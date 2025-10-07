import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface TypeVehicle {
  type_id: number;
  type: string;
  description?: string;
}
interface Brand {
    id_brand : number;
    name : string;
    country : string;
    founded_year : number;
    website : string;
}

interface Maintenance {
id_maintenance: number ;
vehicle: number;
vehicle_regisNumber: string;
driver: number;
driver_name: string;
date: string;
type: string;
prix: number;
total: number;
observation: string;

}



interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Maintenances: React.FC = () => {
  // State declarations
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicletypes, setVehicleTypes] = useState<TypeVehicle[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [typemaintenances, setTypeCarburants] = useState<any[]>([]);
  const [editingType, setEditingType] = useState<TypeVehicle | null>(null);
  const [showAddTypeModal, setShowAddTypeModal] = useState<boolean>(false);
  const [showAddBrand, setShowAddBrand] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState<boolean>(false);
  const [editingMaintenance, seteditingMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [brandForm, setBrandForm] = useState({
  name: "",
  country: "",
  founded_year: "",
  website: ""
});
  const [formData, setFormData] = useState({
  id_maintenance: 0 ,
vehicle: 0,
vehicle_regisNumber: '',
driver: 0,
driver_name: '',
date: '',
type: '',
prix: 0,
total: 0,   
observation: '',

  });

  // Fetch maintenances
  const fetchMaintenances = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/maintenances/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Mileage Records API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setMaintenances(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.maintenances)) {
        // If the response has an maintenances property
        setMaintenances(response.data.maintenances);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setMaintenances([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      Swal.fire('Error!', 'Failed to fetch maintenances.', 'error');
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchform = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/kms/form/`, {
            params: { id: user.id ? user.id : '' },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setVehicles(response.data.vehicles || []);
      setDrivers(response.data.drivers || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setVehicles([]);
    }
  }, []);

  // Fetch vehicle types on component mount
  
  
  // Initial data loading
  useEffect(() => {
    fetchform();
    fetchMaintenances(1);
  }, [fetchMaintenances, fetchform]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchMaintenances(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchMaintenances(page, searchInput);
    }
  };
  /*
const handleInputChangeVehicle = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  const selectedVehicle = vehicles.find(v => v.id_vehicle === parseInt(value));
  formData.depart = selectedVehicle ? selectedVehicle.kilometrage : 0;
  if (selectedVehicle) {
    setFormData(prev => ({ ...prev, vehicle: selectedVehicle.id_vehicle, vehicle_regisNumber: selectedVehicle.regisNumber }));
  } else {
    setFormData(prev => ({ ...prev, vehicle: 0, vehicle_regisNumber: '' }));
  }
  //
};*/
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
const handleBrandInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setBrandForm(prev => ({ ...prev, [name]: value }));
};

  // Open edit model modal
  const openEditMaintenanceModal = (maintenance: Maintenance) => {
    seteditingMaintenance(maintenance);


    setFormData({
        id_maintenance: maintenance.id_maintenance ,
vehicle: maintenance.vehicle,
vehicle_regisNumber: maintenance.vehicle_regisNumber,
driver: maintenance.driver,
driver_name: maintenance.driver_name,
date: maintenance.date,
type: maintenance.type,
prix: maintenance.prix,
total: maintenance.total,
observation: maintenance.observation,

});
    setShowAddMaintenanceModal(true);
  };

  // Open add maintenance modal
  const openAddMaintenanceModal = () => {
    seteditingMaintenance(null);
    setFormData({
    id_maintenance: 0 ,
vehicle: 0,
vehicle_regisNumber: '',
driver: 0,
driver_name: '',
date: '',
type: '',
prix: 0,
total: 0,
observation: '',
    });
    setShowAddMaintenanceModal(true);
  };

  // Submit maintenance form
  const submitMaintenanceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingMaintenance?.id_maintenance || null
      };
             const apiurl = import.meta.env.VITE_API_URL;
      console.log('Submitting maintenance form with payload:', editingMaintenance);
      const url = editingMaintenance ? `${apiurl}/maintenances/${editingMaintenance.id_maintenance}/` : `${apiurl}/maintenances/`;
      const method = editingMaintenance ? 'put' : 'post';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
    params : { id: user.id ? user.id : '' },
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Maintenance ${editingMaintenance ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddMaintenanceModal(false);
        fetchMaintenances(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save maintenance.', 'error');
      }
    } catch (error) {
      console.error('Error saving maintenance:', error);
      Swal.fire('Error!', 'Failed to save maintenance.', 'error');
    }
  };

  // Delete maintenance
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
          await axios.delete(`${apiurl}/maintenances/${id}/`, {
    params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      "Content-Type": "application/json",
    },
  });

          Swal.fire('Deleted!', 'The maintenance has been deleted.', 'success');
          fetchMaintenances(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting maintenance:', error);
          Swal.fire('Error!', 'Failed to delete the maintenance.', 'error');
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
      // Implementation for submitting maintenance type
      // Similar to submitMaintenanceForm but for maintenance types
      
      
    } catch (error) {
      console.error('Error saving maintenance type:', error);
      Swal.fire('Error!', 'Failed to save maintenance type.', 'error');
    }
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
                <h3 className="mb-0">Maintenances</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddMaintenanceModal}>
                        + Add Maintenance
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
                            <th>Matricuel</th>
                            <th>date</th>
                            <th>type</th>
                            <th>prix</th>
                            <th>total</th>
      
                            <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenances.length > 0 ? (
                          maintenances.map(maintenance => (
                            <tr key={maintenance.id_maintenance}>
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
                                      <a href="#!" className="text-inherit">{maintenance.vehicle_regisNumber}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{maintenance.date}</td>
                              <td>
                                {maintenance.type}
                              </td>
                              <td>{maintenance.prix}</td>
                                <td>{maintenance.total}</td>
                                { maintenance && (
                              <td>
<a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                         <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditMaintenanceModal(maintenance)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(maintenance.id_maintenance)}
                                >
                                  <i className="fe fe-trash"></i>
                                </button>
                              </td>
                                )

                                }
                                { !maintenance && (
                              <td>
                              </td>
                                )}
                                
                       
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No maintenances found
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

      {/* Add/Edit Maintenance Modal */}
      {/*showAddMaintenanceModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingMaintenance ? 'Edit Maintenance' : 'Add Maintenance'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddMaintenanceModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitMaintenanceForm}>
                  <input type="hidden" name="id" value={editingMaintenance?.id_maintenance || ''} />
                <div className="mb-3">
                    <label htmlFor="date" className='form-label'>Date</label>
                    <input
                      type="date"
                      className="form-control"
                        placeholder="Enter date"
                        name="date"

                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />

                </div>
                  <div  className="mb-3">
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Vehicle</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
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
                      <option value="">Select Vehicle</option>
                      {Array.isArray(vehicles) && vehicles.map(v => (
                        <option key={v.id_vehicle} value={v.id_vehicle}>
                          {v.regisNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div  className="mb-3">
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Driver</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
                        Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="driver"
                      value={formData.driver}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select driver</option>
                      {Array.isArray(drivers) && drivers.map(d => (
                        <option key={d.id_driver} value={d.id_driver}>
                          {d.driverFullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Fuel Type</label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="CNG">CNG</option>
                      <option value="LPG">LPG</option>
                      <option value="Hydrogen">Hydrogen</option>
                      <option value="Biofuel">Biofuel</option>
                      <option value="Ethanol">Ethanol</option>
                      <option value="Biodiesel">Biodiesel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter name"
                      name="total"
                      value={formData.total}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
             <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Quantity (Liters)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter quantity"
                      name="quantite"
                      value={formData.quantite}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                    <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Price (Liters)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter price"
                      name="prix"
                      value={formData.quantite}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter mission/activity"
                      name="observation"
                      value={formData.observation}
                      onChange={handleInputChange}
                      required
                    >
                    </textarea>
                  </div>
                  
                
                 
               
                  
            
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingMaintenance ? 'Update' : '+ Submit'} Maintenance
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddMaintenanceModal(false)}
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
         {showAddTypeModal && (
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
      {/* Add Maintenance Type Modal */}
     
    </div>
  );
};

export default Maintenances;