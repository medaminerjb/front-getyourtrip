import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface PeriodType {
  pk: number;
  name: string;
  description?: string;
}

interface Period {
    pk: number;
    name: string;
    description?: string;
    user_id: number;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Companies: React.FC = () => {
  // State declarations
  const [periods, setCompanies] = useState<Period[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddPeriodModal, setShowAddPeriodModal] = useState<boolean>(false);
  const [editingPeriod, seteditingPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const apiurl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    pk: 0,
    name: '',
    description: '',
  });

  // Fetch activities
  const fetchCompanies = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/insurance/periods`, {
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
        setCompanies(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.periods)) {
        // If the response has an activities property
        setCompanies(response.data.periods);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setCompanies([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // Initial data loading
  useEffect(() => {
    fetchCompanies(1);
  }, [fetchCompanies]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchCompanies(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchCompanies(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit period modal
  const openEditPeriodModal = (period: Period) => {
    seteditingPeriod(period);


    setFormData({
        pk: period.pk || 0,
      name: period.name.toString(),
      description: period.description || '',
    });
    setShowAddPeriodModal(true);
  };

  // Open add period modal
  const openAddPeriodModal = () => {
    seteditingPeriod(null);
    setFormData({
      pk: 0,
      name: '',
      description: '',
    });
    setShowAddPeriodModal(true);
  };

  // Submit period form
  const submitPeriodForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingPeriod?.pk || null,
        user_id : user.id
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingPeriod ? `${apiurl}/insurance/periods` : `${apiurl}/insurance/periods`;
      const method = editingPeriod ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Period ${editingPeriod ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddPeriodModal(false);
        fetchCompanies(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save period.', 'error');
      }
    } catch (error) {
      console.error('Error saving period:', error);
      Swal.fire('Error!', 'Failed to save period.', 'error');
    }
  };

  // Delete period
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
          await axios.delete(`${apiurl}/insurance/periods`, {
            
            params: { user_id : user.id ,id: id },
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  },
});
          Swal.fire('Deleted!', 'The period has been deleted.', 'success');
          fetchCompanies(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting period:', error);
          Swal.fire('Error!', 'Failed to delete the period.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting period type
      // Similar to submitPeriodForm but for period types
      
      
    } catch (error) {
      console.error('Error saving period type:', error);
      Swal.fire('Error!', 'Failed to save period type.', 'error');
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
                      <button className="btn btn-primary me-2" onClick={openAddPeriodModal}>
                        + Add Period
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
                          <th>Period Name</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {periods.length > 0 ? (
                          periods.map(period => (
                            <tr key={period.pk}>
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
                                      <a href="#!" className="text-inherit">{period.name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{period.description}</td>
                              {user.id == period.user_id || user.is_superuser ? (
 <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditPeriodModal(period)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(period.pk)}
                                >
                                  <i className="fe fe-trash"></i>
                                </button>
                              </td>) : (<td></td>)

                              }
                             
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No period found
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

      {/* Add/Edit Period Modal */}
      {showAddPeriodModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingPeriod ? 'Edit Period' : 'Add Period'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddPeriodModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitPeriodForm}>
                  <input type="hidden" name="id" value={editingPeriod?.pk || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Period name</label>
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
                    <label className="form-label">description name</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Country"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    >
                    </textarea>

                  </div>
            
               
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingPeriod ? 'Update' : '+ Submit'} Period
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddPeriodModal(false)}
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

      {/* Add Period Type Modal */}
     
    </div>
  );
};

export default Companies;