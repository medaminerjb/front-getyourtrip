import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface InstallmentType {
  pk: number;
  name: string;
  description?: string;
}

interface InstallmentHistorique{
    installment_id: number;
    id: number;
    vehicle : string;
    date : string;    
    payment_status: string;
    user_id: number;
    amount_paid : string;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const InstallmentHistoriques: React.FC = () => {
  // State declarations
  const [installmenthistoriques, setInstallmentHistoriques] = useState<InstallmentHistorique[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [showAddInstallmentModal, setShowAddInstallmentModal] = useState<boolean>(false);
  const [editingInstallmentHistorique, seteditingInstallmentHistorique] = useState<InstallmentHistorique| null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const apiurl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    installment_id: 0,
    id : 0,
    vehicle : '',
        date : "",    
    payment_status: '',
    user_id: 0,
    amount_paid : '',
  });

  // Fetch activities
  const fetchInstallmentHistoriques = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/installments/payments/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Installment Historiques API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setInstallmentHistoriques(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.installmenthistoriques)) {
        // If the response has an activities property
        setInstallmentHistoriques(response.data.installmenthistoriques);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setInstallmentHistoriques([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setInstallmentHistoriques([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchform = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/installments/payments/form/`, {
            params: { id: user.id ? user.id : '' },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setVehicles([]);
    }
  }, []);
  // Initial data loading
  useEffect(() => {
    fetchInstallmentHistoriques(1);
    fetchform();
  }, [fetchInstallmentHistoriques, fetchform]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchInstallmentHistoriques(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchInstallmentHistoriques(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit installment modal
  const openEditInstallmentModal = (installment: InstallmentHistorique) => {
    seteditingInstallmentHistorique(installment);


    setFormData({
            installment_id: installment.installment_id,
    id : installment.id,
    vehicle : installment.vehicle,
        date : installment.date,    
    payment_status: installment.payment_status,
    user_id: installment.user_id || 0,
    amount_paid : installment.amount_paid,
    });
    setShowAddInstallmentModal(true);
  };

  // Open add installment modal
  const openAddInstallmentModal = () => {
    seteditingInstallmentHistorique(null);
    setFormData({
            installment_id: 0,
    id : 0,
    vehicle : '',
        date : "",    
    payment_status: '',
    user_id: 0,
    amount_paid : '',
    });
    setShowAddInstallmentModal(true);
  };

  // Submit installment form
  const submitInstallmentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingInstallmentHistorique?.id || null,
        user_id : user.id,
        installment_id : formData.vehicle
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingInstallmentHistorique? `${apiurl}/installments/payments/` : `${apiurl}/installments/payments/`;
      const method = editingInstallmentHistorique? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `InstallmentHistorique${editingInstallmentHistorique? 'updated' : 'added'} successfully.`, 'success');
        setShowAddInstallmentModal(false);
        fetchInstallmentHistoriques(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save installment.', 'error');
      }
    } catch (error) {
      console.error('Error saving installment:', error);
      Swal.fire('Error!', 'Failed to save installment.', 'error');
    }
  };

  // Delete installment
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
          await axios.delete(`${apiurl}/installments/payments/`, {
            
            params: { user_id : user.id ,id: id },
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  },
});
          Swal.fire('Deleted!', 'The installment has been deleted.', 'success');
          fetchInstallmentHistoriques(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting installment:', error);
          Swal.fire('Error!', 'Failed to delete the installment.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting installment type
      // Similar to submitInstallmentForm but for installment types
      
      
    } catch (error) {
      console.error('Error saving installment type:', error);
      Swal.fire('Error!', 'Failed to save installment type.', 'error');
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
                <h3 className="mb-0">Installment Historiques</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                       
                      <button className="btn btn-primary me-2" onClick={openAddInstallmentModal}>
                        + Add Installment
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
                            <th>Matricuel</th>
                            <th>Date payment</th>
                            <th>Paied Amount</th>
                            <th>payment status</th>
                            <th>Installment</th>
                            <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {installmenthistoriques.length > 0 ? (
                          installmenthistoriques.map(installment => (
                            <tr key={installment.id}>
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
                                      <a href="#!" className="text-inherit">{installment.vehicle}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                                <td>{installment.date}</td>
                                <td>{installment.amount_paid}</td> 
                                <td>{installment.payment_status}</td> 
                                <td>Type</td>
                              {user.id == installment.user_id || user.is_superuser ? (
 <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditInstallmentModal(installment)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(installment.id)}
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
                              No installment found
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

      {/* Add/Edit InstallmentHistoriqueModal */}
      {showAddInstallmentModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingInstallmentHistorique? 'Edit Installment' : 'Add Installment'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddInstallmentModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitInstallmentForm}>
                  <input type="hidden" name="id" value={editingInstallmentHistorique?.id || ''} />
                         <div  className="mb-3">
                      <div className="d-flex justify-content-between">
                      <label className="form-label">Vehicle</label>
                      <a href="#!" className="btn-link fw-semi-bold" >
                        Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="vehicle"
                      value={formData.installment_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Vehicle</option>
                      {Array.isArray(vehicles) && vehicles.map(v => (
                        <option key={v.pk} value={v.pk}>
                          {v.vehicle__regisNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter name"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
          
                  <div className="mb-3">
                    <label className="form-label">Amount Paid</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Country"
                      name="amount_paid"
                      value={formData.amount_paid}
                      onChange={handleInputChange}
                      required
                    />

                  </div>
                    <div className="mb-3">
                    <label className="form-label">Payment Status</label>
                    <select
                      className="form-select"
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleInputChange}
                        required
                        >
                        <option value="">Select status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="pending">Pending</option>
                      </select>
                  </div>
            
               
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingInstallmentHistorique? 'Update' : '+ Submit'} Installment
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddInstallmentModal(false)}
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

      {/* Add InstallmentHistoriqueType Modal */}
     
    </div>
  );
};

export default InstallmentHistoriques;