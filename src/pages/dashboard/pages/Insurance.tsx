import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface TypeVehicle {
  type_id: number;
  type: string;
  description?: string;
}
interface Insurance {
    pk : number;
    insurance_company : number;
    description : string;
    policy_number : string;
    start_date : string;
    end_date : string;
    period_name : string;
    vehicle : number;
    vehicle_regisNumber: string;
    insurance_period_name: string;
    insurance_period : number;
    recurring_date : string;
    notes : string;
}
interface Brand {
    id_brand : number;
    name : string;
    country : string;
    founded_year : number;
    website : string;
}

interface Model {
id_model: number ;
model: string;
puissanceA : number | null;
puissanceM : number | null;
bvitesse : string | null;
reservoir : string;
typec : string;
type : string | null;
place : number | null;
bauto : string | null;
brand: string;
public?: boolean;

}

interface Model {
    id_model : number;
    name : string;
    country : string;
    founded_year : number;
    website : string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Insurances: React.FC = () => {
  // State declarations
  const [insurances, setInsurances] = useState<Insurance[]>([]);

  const [vehicletypes, setVehicleTypes] = useState<TypeVehicle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [insuranceperiods, setInsurancePeriods] = useState<any[]>([]);
  const [insurancecompanies, setInsuranceCompanies] = useState<any[]>([]);
  const [typecarburants, setTypeCarburants] = useState<any[]>([]);
  const [editingType, setEditingType] = useState<TypeVehicle | null>(null);
  const [showAddTypeModal, setShowAddTypeModal] = useState<boolean>(false);
  const [showAddBrand, setShowAddBrand] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddInsuranceModal, setShowAddInsuranceModal] = useState<boolean>(false);
  const [showAddVehicle , setShowAddVehicle] = useState<boolean>(false);

  const [editingInsurance, seteditingInsurance] = useState<Insurance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [brandForm, setBrandForm] = useState({
  name: "",
  country: "",
  founded_year: "",
  website: ""
});
  const [formData, setFormData] = useState({
 pk: 0,
insurance_company: 0,
description : '',
policy_number : '',
start_date : '',
end_date : '',
period_name : '',
vehicle : 0 ,
insurance_period : 0,
recurring_date : '',
notes : '',
  });

  // Fetch insurances
  const fetchInsurances = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/insurances/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Insurances API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setInsurances(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.insurances)) {
        // If the response has an insurances property
        setInsurances(response.data.insurances);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setInsurances([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching insurances:', error);
      Swal.fire('Error!', 'Failed to fetch insurances.', 'error');
      setInsurances([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchform = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/insurance/form`, {
            params: { id: user.id ? user.id : '' },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setVehicles(response.data.vehicles || []);
      setInsurancePeriods(response.data.periods || []);
      setInsuranceCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setVehicleTypes([]);
    }
  }, []);

  // Fetch vehicle types on component mount
  
  
  // Initial data loading
  useEffect(() => {
    fetchform();
    fetchInsurances(1);
  }, [fetchInsurances, fetchform]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchInsurances(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchInsurances(page, searchInput);
    }
  };

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
  const openEditInsuranceModal = (insurance: Insurance) => {
    seteditingInsurance(insurance);

console.log(insurance);
    setFormData({
   pk: insurance.pk || 0,
insurance_company: insurance.insurance_company ? insurance.insurance_company : 0,
description : insurance.description || '',
policy_number : insurance.policy_number || '',
start_date : insurance.start_date ? insurance.start_date : '',
end_date : insurance.end_date ? insurance.end_date : '',
period_name : insurance.period_name ? insurance.period_name : '',
vehicle : insurance.vehicle ? insurance.vehicle : 0,
insurance_period : insurance.insurance_period ? insurance.insurance_period : 0,
recurring_date : insurance.recurring_date ? insurance.recurring_date : '',
notes : insurance.notes ? insurance.notes : '',
});
    setShowAddInsuranceModal(true);
  };

  // Open add model modal
  const openAddInsuranceModal = () => {
    seteditingInsurance(null);
    setFormData({
  pk: 0,
insurance_company: 0,
description : '',
policy_number : '',
start_date : '',
end_date : '',
period_name : '',
vehicle : 0,
insurance_period : 0,
recurring_date : '',
notes : '',
    });
    setShowAddInsuranceModal(true);
  };

  // Submit model form
  const submitInsuranceForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingInsurance?.pk || null
      };
             const apiurl = import.meta.env.VITE_API_URL;
      console.log('Submitting model form with payload:', editingInsurance);
      const url = editingInsurance ? `${apiurl}/insurances/${editingInsurance.pk}/` : `${apiurl}/insurances/`;
      const method = editingInsurance ? 'put' : 'post';
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
        Swal.fire('Success!', `Insurance ${editingInsurance ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddInsuranceModal(false);
        fetchInsurances(pagination?.current_page || 1, searchInput);
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
          await axios.delete(`${apiurl}/insurances/${id}/`, {
    params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      "Content-Type": "application/json",
    },
  });

          Swal.fire('Deleted!', 'The insurance has been deleted.', 'success');
          fetchInsurances(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting insurance:', error);
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
      // Similar to submitInsuranceForm but for model types
      
      
    } catch (error) {
      console.error('Error saving model type:', error);
      Swal.fire('Error!', 'Failed to save model type.', 'error');
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
                <h3 className="mb-0">Insurances</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddInsuranceModal}>
                        + Add Insurance
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
                            <th>insurance period</th>
                            <th>Period</th>
                            <th>policy number</th>
                            <th>insurance company</th>        
                            <th>Actions</th>
                        </tr>   
                      </thead>
                      <tbody>
                        {insurances.length > 0 ? (
                          insurances.map(insurance => (
                            <tr key={insurance.pk}>
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
                                      <a href="#!" className="text-inherit">{insurance.vehicle_regisNumber}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{insurance.insurance_period_name}</td>
                              <td>{insurance.start_date} -- {insurance.end_date}</td>
                              <td>
                                {insurance.policy_number}
                              </td>
                              <td>{insurance.insurance_company}</td>
           
                                { insurance && (
                              <td>
<a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                         <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditInsuranceModal(insurance)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(insurance.pk)}
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
                              No insurances found
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

      {/* Add/Edit Insurance Modal */}
      {showAddInsuranceModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingInsurance ? 'Edit Insurance' : 'Add Model'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddInsuranceModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitInsuranceForm}>
                  <input type="hidden" name="id" value={editingInsurance?.pk || ''} />
                  <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">Vehicle</label>
                        {/*}
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
                      Add New
                      </a>
                      {*/}
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
                        <option key={vehicle.pk} value={vehicle.pk}>
                          {vehicle.regisNumber}
                        </option>
                      ))}
                    </select>

                  </div>
                    <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">insurance period</label>
                      {/*}
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
                      Add New
                      </a>
                      {*/}
                    </div>
                    <select
                      className="form-select"
                      name="insurance_period"
                      value={formData.insurance_period}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {Array.isArray(insuranceperiods) && insuranceperiods.map(d => (
                        <option key={d.pk} value={d.pk}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                  </div>
                         <div className='mb-3'>
                            <div className="d-flex justify-content-between">
                      <label className="form-label">insurance company</label>
                       {/*}
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
                      Add New
                      </a>
                      {*/}
                    </div>
                    <select
                      className="form-select"
                      name="insurance_company"
                      value={formData.insurance_company}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select vehicle</option>
                      {Array.isArray(insurancecompanies) && insurancecompanies.map(d => (
                        <option key={d.pk} value={d.pk}>
                          {d.name}
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
                    <label htmlFor="activiteName" className="form-label">recurring date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter name"
                      name="recurring_date"
                      value={formData.recurring_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">policy number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      name="policy_number"
                      value={formData.policy_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">notes</label>
                    <textarea name="notes" className="form-control" value={formData.notes}          onChange={handleInputChange} id=""></textarea>
                  
                  </div>
        
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingInsurance ? 'Update' : '+ Submit'} Model
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddInsuranceModal(false)}
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

export default Insurances;