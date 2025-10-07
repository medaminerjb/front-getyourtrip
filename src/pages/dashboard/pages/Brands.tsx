import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface BrandType {
  pk: number;
  name: string;
  description?: string;
}


interface Brand {
    id_brand : number;
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

const Brands: React.FC = () => {
  // State declarations
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddBrandModal, setShowAddBrandModal] = useState<boolean>(false);
  const [editingBrand, seteditingBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    id_brand: '',
    name: '',
    country: '',
    founded_year: '',
    website: '',
  });

  // Fetch activities
  const fetchBrands = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/vehicles/brands`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Activities API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setBrands(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.brands)) {
        // If the response has an activities property
        setBrands(response.data.brands);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setBrands([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // Initial data loading
  useEffect(() => {
    fetchBrands(1);
  }, [fetchBrands]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchBrands(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchBrands(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit brand modal
  const openEditBrandModal = (brand: Brand) => {
    seteditingBrand(brand);


    setFormData({
        id_brand: brand.id_brand.toString(),
      name: brand.name.toString(),
      country: brand.country.toString(),
      founded_year: brand.founded_year.toString(),
      website: brand.website
    });
    setShowAddBrandModal(true);
  };

  // Open add brand modal
  const openAddBrandModal = () => {
    seteditingBrand(null);
    setFormData({
      id_brand: '',
      name: '',
      country: '',
      founded_year: '',
      website: '',
    });
    setShowAddBrandModal(true);
  };

  // Submit brand form
  const submitBrandForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingBrand?.id_brand || null
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingBrand ? `${apiurl}/vehicles/brands/${editingBrand.id_brand}/` : `${apiurl}/vehicles/brands`;
      const method = editingBrand ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Brand ${editingBrand ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddBrandModal(false);
        fetchBrands(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save brand.', 'error');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      Swal.fire('Error!', 'Failed to save brand.', 'error');
    }
  };

  // Delete brand
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
          await axios.delete(`/api/activities/${id}/`);
          Swal.fire('Deleted!', 'The brand has been deleted.', 'success');
          fetchBrands(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting brand:', error);
          Swal.fire('Error!', 'Failed to delete the brand.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting brand type
      // Similar to submitBrandForm but for brand types
      
      
    } catch (error) {
      console.error('Error saving brand type:', error);
      Swal.fire('Error!', 'Failed to save brand type.', 'error');
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
                <h3 className="mb-0">Activities</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddBrandModal}>
                        + Add Brand
                      </button>
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <input
                        type="search"
                        className="form-control"
                        placeholder="Search for name"
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                      />
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
                          <th>Name</th>
                          <th>Brand Type</th>
                          <th>Duration</th>
                          <th>Destination</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {brands.length > 0 ? (
                          brands.map(brand => (
                            <tr key={brand.id_brand}>
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
                                      <a href="#!" className="text-inherit">{brand.name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{brand.country}</td>
                              <td>
                                {brand.founded_year}
                              </td>
                              <td>{brand.website}</td>
                              <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="bi bi-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditBrandModal(brand)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(brand.id_brand)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No activities found
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

      {/* Add/Edit Brand Modal */}
      {showAddBrandModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingBrand ? 'Edit Brand' : 'Add Brand'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddBrandModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitBrandForm}>
                  <input type="hidden" name="id" value={editingBrand?.id_brand || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Brand name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      value={formData.country}
                      onChange={handleInputChange}
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
                      value={formData.founded_year}
                      onChange={handleInputChange}
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
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingBrand ? 'Update' : '+ Submit'} Brand
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddBrandModal(false)}
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

      {/* Add Brand Type Modal */}
     
    </div>
  );
};

export default Brands;