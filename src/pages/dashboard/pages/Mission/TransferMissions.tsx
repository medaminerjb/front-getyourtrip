import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import VehicleModal from 'sub-components/mission/VehicleModel';
import DriverModal from 'sub-components/mission/DriverModel';
import AgencyModal from 'sub-components/mission/AgencyModel';
import GuideModal from 'sub-components/mission/GuideModel';
//import ActivityTransferModel from 'sub-components/mission/ActivityTransferModel';
// Define TypeScript interfaces
interface TypeVehicle {
  type_id: number;
  type: string;
  description?: string;
}
interface Mission {
    pk : number;
    activity_name : string;
    activity:number;
    activity_type :string;
    start_date : string;
    end_date : string;
    start_time:string;
    end_time:string;
    vehicle:number;
    vehicle_regisNumber:string;
    driver:number;
    driver_name:string;
    agency :number;
    status:string;
    guide:number;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const MissionsTransfer: React.FC = () => {
  // State declarations
  const [missions, setMissions] = useState<Mission[]>([]);

  const [vehicletypes, setVehicleTypes] = useState<TypeVehicle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activities,setActivities]=useState<any[]>([]);
  const [drivers,setDrivers] = useState<any[]>([]);
  const [agencies,setAgencies] = useState<any[]>([]);
  const [guides,setGuides] = useState<any[]>([]);
  
  const [missionperiods, setMissionPeriods] = useState<any[]>([]);
  const [missioncompanies, setMissionCompanies] = useState<any[]>([]);
  const [typecarburants, setTypeCarburants] = useState<any[]>([]);
  const [editingType, setEditingType] = useState<TypeVehicle | null>(null);
  const [showAddTypeModal, setShowAddTypeModal] = useState<boolean>(false);
  const [showAddBrand, setShowAddBrand] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddMissionModal, setShowAddMissionModal] = useState<boolean>(false);
  const [showAddVehicle , setShowAddVehicle] = useState<boolean>(false);
  const [showAddDriver,setShowAddDriver] = useState<boolean>(false);
  const [showAddGuide,setShowAddGuide] =useState<boolean>(false);
  const [showAddAgency,setShowAddAgency] =useState<boolean>(false);
  const [showAddActivityTransfer,setShowAddActivityTransfer]=useState<boolean>(false);

  const  [searchvehicledriver,setsearchvehicledriver]=useState<boolean>(false);
  const [validform,setvalidform]=useState<boolean>(false);

  const [editingMission, seteditingMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [brandForm, setBrandForm] = useState({
  name: "",
  country: "",
  founded_year: "",
  website: ""
});
  const [formData, setFormData] = useState({
 pk: 0,
    activity:0,
    activity_type :'',
    start_date : '',
    end_date : '',
    start_time:'',
    end_time:'',
    vehicle:0,
    driver:0,
    agency:0,
    guide:0,
       status:"pending",
  });

  // Fetch missions
  const fetchMissions = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/missions/transfer`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Missions API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setMissions(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.missions)) {
        // If the response has an missions property
        setMissions(response.data.missions);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setMissions([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      Swal.fire('Error!', 'Failed to fetch missions.', 'error');
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchform = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/mission/form`, {
            params: { id: user.id ? user.id : '' ,tenant:user.tenant,activity_type:"transfer"},
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setAgencies(response.data.agencies || []);
      setGuides(response.data.guides || []);
      setActivities(response.data.activities|| []);
      setDrivers(response.data.drivers|| []);
      setVehicles(response.data.vehicles|| []);

    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setAgencies([]);
      setGuides([]);
      setActivities([]);

    }
  }, []);

  // Fetch vehicle types on component mount
  
  
  // Initial data loading
  useEffect(() => {
    fetchform();
    fetchMissions(1);
  }, [fetchMissions, fetchform]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchMissions(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchMissions(page, searchInput);
    }
  };

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
const test = formData.start_date && formData.start_time && formData.end_time && formData.end_date;
  if (['start_date','end_date','end_time','start_time'].includes(name)&&(test)) {
    handleSearch();
  }
  setFormData((prev) => {
    const updated = { ...prev, [name]: value };

    // Validation
    if (updated.start_date && updated.end_date) {
      const startDate = new Date(updated.start_date);
      const endDate = new Date(updated.end_date);

      if (endDate < startDate) {
        updated.end_date = ""; // reset invalid
      }
    }

    if (
      updated.start_date &&
      updated.end_date &&
      updated.start_time &&
      updated.end_time &&
      updated.start_date === updated.end_date
    ) {
      if (updated.end_time <= updated.start_time) {
        updated.end_time = ""; // reset invalid
      }
    }

    return updated;
  });
};
const handleBrandInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setBrandForm(prev => ({ ...prev, [name]: value }));
};

  // Open edit model modal
  const openEditMissionModal = (mission: Mission) => {
    seteditingMission(mission);
 
    setFormData({
   pk: mission.pk || 0,
   activity : mission.activity,
   activity_type:mission.activity_type,
   start_date:mission.start_date,
   end_date:mission.end_date,
   start_time:mission.start_time,
   end_time:mission.end_time,
   vehicle:mission.vehicle,
   driver:mission.driver,
   status:mission.status,
   agency:mission.agency,
   guide:mission.guide

});
setvalidform(true);
setsearchvehicledriver(true);
setShowAddMissionModal(true);
handleSearch();

  };

  // Open add model modal
  const openAddMissionModal = () => {
    seteditingMission(null);
    setFormData({
    pk: 0,
    activity:0,
    activity_type :'',
    start_date : '',
    end_date : '',
    start_time : '',
    end_time : '',
    vehicle:0,
    driver:0,
    status:"pending",
    agency:0,
    guide:0
    });
    setvalidform(false);
    setsearchvehicledriver(false);
    setShowAddMissionModal(true);
  };

  // Submit model form
  const submitMissionForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const payload = {
        ...formData,
        id: editingMission?.pk || null,
        tenant:user.tenant
      };
             const apiurl = import.meta.env.VITE_API_URL;
      const url = editingMission ? `${apiurl}/missions/transfer/` : `${apiurl}/missions/transfer/`;
      const method = editingMission ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
    params : { id: user.id ? user.id : '' },
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Mission ${editingMission ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddMissionModal(false);
        fetchMissions(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save model.', 'error');
      }
    } catch (error) {
      console.error('Error saving model:', error);
      Swal.fire('Error!', 'Failed to save model.', 'error');
    }
  };

  // Delete model
  const confirmDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to undo this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const apiurl = import.meta.env.VITE_API_URL;
          await axios.delete(`${apiurl}/missions/${id}/`, {
    params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      "Content-Type": "application/json",
    },
  });

          Swal.fire('Deleted!', 'The mission has been deleted.', 'success');
          fetchMissions(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting mission:', error);
          Swal.fire('Error!', 'Failed to delete the model.', 'error');
        }
      }
    });
  };
  const openAddBrandModal = () => {
    setShowAddBrand(true);
    setBrandForm({
      name: "",
      country: "",
      founded_year: "",
      website: ""
    });
  };
  const submitBrandForm = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    name: brandForm.name,
    country: brandForm.country,
    founded_year: parseInt(brandForm.founded_year), // ensure it's a number
    website: brandForm.website,
  };
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('access_token') || '';
  try {
    const response = await axios.post(`${apiurl}/vehicles/brands`, payload, {
      params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
      headers: {
        Authorization: `Bearer ${token}`, // if auth is required
      },
    });

    Swal.fire('Success!', 'Brand added successfully.', 'success');
    setShowAddBrand(false);
    fetchform(); // Refresh the brand list
    console.log("Saved brand:", response.data);

  } catch (error) {
    console.error('Error saving brand:', error);
    Swal.fire('Error!', 'Failed to save brand.', 'error');
  }
};

  const openAddTypeModal = () => {
    
    setEditingType(null);
    setShowAddTypeModal(true);
  };
  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting model type
      // Similar to submitMissionForm but for model types
      
      
    } catch (error) {
      console.error('Error saving model type:', error);
      Swal.fire('Error!', 'Failed to save model type.', 'error');
    }
  };

  const handleSearch = async () => {
    if (formData.end_date&&formData.end_time&&formData.start_date&&formData.start_time)
    {try {
      setLoading(true);
        const apiurl = import.meta.env.VITE_API_URL;
          const token = localStorage.getItem('access_token') || '';
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const payload = {
            date : formData.start_date,
            time : formData.start_time,
            dateend : formData.end_date,
            timeend : formData.end_time,
          }
      const response = await axios.post(`${apiurl}/search-available/details`, payload,{
              params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '',tenant:user.tenant },
      headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
      });
      setDrivers(response.data.drivers); // store results
      setVehicles(response.data.vehicles);
      setsearchvehicledriver(true);
      setvalidform(true);
    } catch (err) {
    } finally {
      setLoading(false);
    }}
  };
  // Render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;
    
    const pages = [];
    for (let i = 1; i <= pagination.total_pages; i++) {
      pages.push(
        <li key={i} className={`page-item ${pagination.current_page === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    
    return (
      <nav>
        <ul className="pagination mb-0">
          <li className="page-item">
            <button 
              className="page-link" 
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </button>
          </li>
          {pages}
          <li className="page-item">
            <button 
              className="page-link" 
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.total_pages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="app-content">
      <div className="app-content-area">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12">
              <div className="mb-5">
                <h3 className="mb-0">Missions</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddMissionModal}>
                        + Add Mission
                      </button>
                    </div>
                    <div className="col-lg-4 col-md-6">
  <div className="input-group">
    <input
      type="search"
      className="form-control"
      placeholder="Search for name"
      value={searchInput}
      onChange={handleSearchChange}
      onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
    />
    <button
      className="btn btn-primary"
      type="button"
      onClick={handleSearchSubmit}
    >
      <i className="fe fe-search"></i> {/* Bootstrap icon */}
    </button>
  </div>
</div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="table-responsive table-card">
                    <table className="table text-nowrap mb-0 table-centered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th className="pe-0">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="checkAll" />
                              <label className="form-check-label" htmlFor="checkAll"></label>
                            </div>
                          </th>
                            <th>name</th>
                            <th>activity type</th>
                            <th>activity date</th>
                            <th>vehicle</th>
                            <th>driver</th>
                            <th>status</th>
                            <th>Actions</th>
                        </tr>   
                      </thead>
                      <tbody>
                        {missions.length > 0 ? (
                          missions.map(mission => (
                            <tr key={mission.pk}>
                              <td className="pe-0">
                                <div className="form-check">
                                  <input className="form-check-input" type="checkbox" />
                                  <label className="form-check-label"></label>
                                </div>
                              </td>
                              <td className="ps-1">
                                <div className="d-flex align-items-center">
                                  <div className="ms-2">
                                    <h5 className="mb-0">
                                      <a href="#!" className="text-inherit">{mission.activity_name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{mission.activity_type}</td>
                              <td>{mission.start_date} -- {mission.end_date}</td>
                              <td>
                                {mission.vehicle_regisNumber}
                              </td>
                              <td>{mission.driver_name}</td>
                              <td>{mission.status}</td>
           
                                { mission && (
                              <td>
<a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                         <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditMissionModal(mission)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(mission.pk)}
                                >
                                  <i className="fe fe-trash"></i>
                                </button>
                              </td>
                                )
                                }
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No missions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {pagination && (
                  <div className="card-footer d-md-flex justify-content-between align-items-center">
                    <span>
                      Showing {pagination.current_range_start} to {pagination.current_range_end} of {pagination.total_results} entries
                    </span>
                    {renderPagination()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Mission Modal */}
      {showAddMissionModal && (
        
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingMission ? 'Edit Mission' : 'Add Model'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddMissionModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitMissionForm}>
                  <input type="hidden" name="id" value={editingMission?.pk || ''} />
                       <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">Activity</label>
                        
                      <a href="#!" className="btn-link fw-semi-bold" onClick={()=>setShowAddActivityTransfer(true)}>
                      Add New
                      </a>
                      
                    </div>
                    <select
                      className="form-select"
                      name="activity"
                      value={formData.activity}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Activity</option>
                      {Array.isArray(activities) && activities.map(a => (
                        <option key={a.pk} value={a.pk}>
                          {a.name}
                        </option>
                      ))}
                    </select>

                  </div>
       
          
                 
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Start date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter name"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
             <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">End date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter name"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                         <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Start time</label>
                    <input
                      type="time"
                      className="form-control"
                      placeholder="Enter name"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
             <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">End time</label>
                    <input
                      type="time"
                      className="form-control"
                      placeholder="Enter name"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                 <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">Guide</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={()=>setShowAddGuide(true)}>
                      Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="guide"
                      value={formData.guide}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select guide</option>
                      {Array.isArray(guides) && guides.map(g => (
                        <option key={g.pk} value={g.pk}>
                          {g.guideFullName}
                        </option>
                      ))}
                    </select>

                  </div>
                      <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">Agency</label>
                    <a href="#!" className="btn-link fw-semi-bold" onClick={()=>setShowAddAgency(true)}>

                      Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="agency"
                      value={formData.agency}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Agency</option>
                      {Array.isArray(agencies) && agencies.map(a => (
                        <option key={a.pk} value={a.pk}>
                          {a.name}
                        </option>
                      ))}
                    </select>

                  </div>
                  {!searchvehicledriver && formData.start_date && formData.start_time && formData.end_date && formData.end_time &&
                  (
  <button 
          type="button" 
          id="searchbutton"
           className="btn btn-outline-info mb-2" 
           onClick={handleSearch}
        >Search vehicle and driver</button>   
                  )

                  }
                                      

                {searchvehicledriver && (<>
                     <div className='mb-3'>
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Vehicle</label>
                        
                      <a href="#!" className="btn-link fw-semi-bold" onClick={()=>setShowAddVehicle(true)}>
                      Add New
                      </a>
                 
                    </div>
                    <select
                      className="form-select"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {Array.isArray(vehicles) && vehicles.map(vehicle => (
                        <option key={vehicle.id_vehicle} value={vehicle.id_vehicle}>
                          {vehicle.regisNumber}
                        </option>
                      ))}
                    </select>

                  </div>
                    <div className='mb-3'>
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Driver</label>
                        {
                      <a href="#!" className="btn-link fw-semi-bold" onClick={()=>setShowAddDriver(true)}>
                      Add New
                      </a>
                      }
                    </div>
                    <select
                      className="form-select"
                      name="driver"
                      value={formData.driver}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Driver</option>
                      {Array.isArray(drivers) && drivers.map(d => (
                        <option key={d.id_driver} value={d.id_driver}>
                          {d.driverFullName}
                        </option>
                      ))}
                    </select>

                  </div>
                </>)

                }
                 {validform && (
                    <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingMission ? 'Update' : '+ Submit'} Model
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddMissionModal(false)}
                    >
                      Close
                    </button>
                  </div>
                 )

                 }
                
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/***/ }
      {/*showAddActivityTransfer && (
        <ActivityTransferModel
        show={showAddActivityTransfer}
        handleClose={()=>setShowAddActivityTransfer(false)}
        GetActivites={fetchform}
        />
      )*/}
    { showAddVehicle && (
      <VehicleModal
      show={showAddVehicle}
      handleClose={()=>setShowAddVehicle(false)}
      handleSearch={handleSearch}
      />
    )}
     { showAddDriver && (
      <DriverModal
      show={showAddDriver}
      handleClose={()=>setShowAddDriver(false)}
      handleSearch={handleSearch}
      />
    )}
    {showAddAgency && (
         <AgencyModal
      show={showAddAgency}
      handleClose={()=>setShowAddAgency(false)}
      GetAgencies={fetchform}
      />
    )}
       {showAddGuide && (
         <GuideModal
      show={showAddGuide}
      handleClose={()=>setShowAddGuide(false)}
      GetGuides={fetchform}
      />
    )}
         {/*showAddTypeModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Vehicle Type</h4>
                <button type="button" className="btn-close" onClick={() => setShowAddTypeModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitTypeForm}>
                  <input type="hidden" name="id" value={editingType?.type_id || ''} />
                  <div className="mb-3">
                    <label className="form-label">Type name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      name="name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      name="description"
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary me-1">
                    + Submit Type
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAddTypeModal(false)}
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
     {showAddBrand && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {'Add Brand'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddBrand(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitBrandForm}>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Brand name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      name="name"
                      value={brandForm.name}
                      onChange={handleBrandInputChange}
                      required
                    />
                  </div>
          
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      name="country"
                      value={brandForm.country}
                      onChange={handleBrandInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Founded Year</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter duration"
                      name="founded_year"
                      value={brandForm.founded_year}
                      onChange={handleBrandInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">website</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter distance"
                      name="website"
                      value={brandForm.website}
                      onChange={handleBrandInputChange}
                      required
                    />
                  </div>
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      { '+ Submit'} Brand
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddBrand(false)}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Model Type Modal */}
     
    </div>
  );
};

export default MissionsTransfer;