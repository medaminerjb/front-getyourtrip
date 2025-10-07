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

const Models: React.FC = () => {
  // State declarations
  const [models, setModels] = useState<Model[]>([]);
  const [vehicletypes, setVehicleTypes] = useState<TypeVehicle[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [typecarburants, setTypeCarburants] = useState<any[]>([]);
  const [editingType, setEditingType] = useState<TypeVehicle | null>(null);
  const [showAddTypeModal, setShowAddTypeModal] = useState<boolean>(false);
  const [showAddBrand, setShowAddBrand] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddModelModal, setShowAddModelModal] = useState<boolean>(false);
  const [editingModel, seteditingModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [brandForm, setBrandForm] = useState({
  name: "",
  country: "",
  founded_year: "",
  website: ""
});
  const [formData, setFormData] = useState({
  id_model: 0,
model: '',
puissanceA : 0,
puissanceM : 0,
bvitesse : '',
reservoir : '',
typec : '',
type : '',
place : '',
bauto : '',
brand: ''
  });

  // Fetch models
  const fetchModels = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/models/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Models API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setModels(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.models)) {
        // If the response has an models property
        setModels(response.data.models);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setModels([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      Swal.fire('Error!', 'Failed to fetch models.', 'error');
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchVehicleTypes = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/vehicle/model/form`, {
            params: { id: user.id ? user.id : '' },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setVehicleTypes(response.data.types || []);
      setBrands(response.data.brands || []);
      setTypeCarburants(response.data.typecarburants || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setVehicleTypes([]);
    }
  }, []);

  // Fetch vehicle types on component mount
  
  
  // Initial data loading
  useEffect(() => {
    fetchVehicleTypes();
    fetchModels(1);
  }, [fetchModels, fetchVehicleTypes]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchModels(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchModels(page, searchInput);
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
  const openEditModelModal = (model: Model) => {
    seteditingModel(model);


    setFormData({
   id_model: model.id_model || 0,
model: model.model || '',
puissanceA : model.puissanceA ? model.puissanceA : 0,
puissanceM : model.puissanceM ? model.puissanceM : 0,
bvitesse : model.bvitesse ? model.bvitesse.toString() : '',
reservoir : model.reservoir || '',
typec : model.typec || '',
type : model.type ? model.type.toString() : '',
place : model.place ? model.place.toString() : '',

bauto : model.bauto || '',
brand: model.brand || ''});
    setShowAddModelModal(true);
  };

  // Open add model modal
  const openAddModelModal = () => {
    seteditingModel(null);
    setFormData({
        id_model: 0,
model: '',
puissanceA : 0,
puissanceM : 0,
bvitesse : '',
reservoir : '',
typec : '',
type : '',
place : '',
bauto : '',
brand: ''
    });
    setShowAddModelModal(true);
  };

  // Submit model form
  const submitModelForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingModel?.id_model || null
      };
             const apiurl = import.meta.env.VITE_API_URL;
      console.log('Submitting model form with payload:', editingModel);
      const url = editingModel ? `${apiurl}/models/${editingModel.id_model}/` : `${apiurl}/models/`;
      const method = editingModel ? 'put' : 'post';
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
        Swal.fire('Success!', `Model ${editingModel ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddModelModal(false);
        fetchModels(pagination?.current_page || 1, searchInput);
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
          await axios.delete(`${apiurl}/models/${id}/`, {
    params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      "Content-Type": "application/json",
    },
  });

          Swal.fire('Deleted!', 'The model has been deleted.', 'success');
          fetchModels(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting model:', error);
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
    fetchVehicleTypes(); // Refresh the brand list
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
      // Similar to submitModelForm but for model types
      
      
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
                <h3 className="mb-0">Models</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddModelModal}>
                        + Add Model
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
                                  <th>Model</th>
                                  <th>Puissance administrative</th>
                                  <th>Puissance moteur </th>
                                  <th>Boite vitesse</th>
                                  <th>reservoir</th>
                                  <th>type Carburant</th>
                                  <th>type vehicle</th>
                                  <th>number of place </th>
                                  <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {models.length > 0 ? (
                          models.map(model => (
                            <tr key={model.id_model}>
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
                                      <a href="#!" className="text-inherit">{model.model}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{model.puissanceA}</td>
                              <td>
                                {model.puissanceM}
                              </td>
                              <td>{model.bvitesse}</td>
                              <td>{model.reservoir}</td>
                               <td>{model.typec}</td>
                                <td>{model.type}</td>
                                 <td>{model.place}</td>
                                { !model.public && (
                              <td>
<a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                         <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditModelModal(model)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(model.id_model)}
                                >
                                  <i className="fe fe-trash"></i>
                                </button>
                              </td>
                                )

                                }
                                { model.public && (
                              <td>
                              </td>
                                )}
                                
                       
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No models found
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

      {/* Add/Edit Model Modal */}
      {showAddModelModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingModel ? 'Edit Model' : 'Add Model'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddModelModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitModelForm}>
                  <input type="hidden" name="id" value={editingModel?.id_model || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Model name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
          
                  <div className="mb-3">
                    <label className="form-label">Puissance administrative</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Country"
                      name="puissanceA"
                      value={formData.puissanceA}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Puissance moteur</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter puissance"
                      name="puissanceM"
                      value={formData.puissanceM}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Boite vitesse type</label>
                    <select
                      className="form-select"
                      name="bauto"
                      value={formData.bauto}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select type</option>
                      <option value="true">Automatic</option>
                      <option value="false">Manual</option>
                    </select>
                  </div>
                              <div className="mb-3">
                    <label className="form-label">Boite vitesse</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter duration"
                      name="bvitesse"
                      value={formData.bvitesse}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">reservoir</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter website"
                      name="reservoir"
                      value={formData.reservoir}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">type Carburant</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter website"
                      name="typec"
                      value={formData.typec}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div  className="mb-3">
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Brand</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddBrandModal}>
                        Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select brand</option>
                      {Array.isArray(brands) && brands.map(brand => (
                        <option key={brand.id_brand} value={brand.id_brand}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <label className="form-label">Vehicle type</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddTypeModal}>
                        Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select type</option>
                      {Array.isArray(vehicletypes) && vehicletypes.map(type => (
                        <option key={type.type_id} value={type.type_id}>
                          {type.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">number of place</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter website"
                      name="place"
                      value={formData.place}
                      onChange={handleInputChange}
                      required
                    />
                  </div>  
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingModel ? 'Update' : '+ Submit'} Model
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddModelModal(false)}
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
      {/* Add Model Type Modal */}
     
    </div>
  );
};

export default Models;