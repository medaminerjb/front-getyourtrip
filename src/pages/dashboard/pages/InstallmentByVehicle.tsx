import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface InstallmentType {
  pk: number;
  name: string;
  description?: string;
}

interface Installment {
    id_installment: number;
    vehicle : string;
    installment_total_number : number;
    installment_paid_number : number;
    amount_paid_total : string;
    amount_to_pay_total : number;
    installment_start_date : number;
    installment_end_date : string;    
    payment_status: string;
    user_id: number;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Installments: React.FC = () => {
  // State declarations
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddInstallmentModal, setShowAddInstallmentModal] = useState<boolean>(false);
  const [editingInstallment, seteditingInstallment] = useState<Installment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const apiurl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    id_installment: 0,
    vehicle : '',
    installment_total_number : 0,
    installment_paid_number : 0,
    amount_paid_total : '',
    amount_to_pay_total : 0,
    installment_start_date : 0,
    installment_end_date : '',    
    payment_status: '',
    user_id: 0
  });

  // Fetch activities
  const fetchInstallments = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/installments/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Installments API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setInstallments(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.installments)) {
        // If the response has an activities property
        setInstallments(response.data.installments);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setInstallments([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setInstallments([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // Initial data loading
  useEffect(() => {
    fetchInstallments(1);
  }, [fetchInstallments]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchInstallments(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchInstallments(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit installment modal
  const openEditInstallmentModal = (installment: Installment) => {
    seteditingInstallment(installment);


    setFormData({
         id_installment: installment.id_installment || 0,
    vehicle : installment.vehicle || '',
    installment_total_number : installment.installment_total_number || 0,
    installment_paid_number : installment.installment_paid_number || 0,
    amount_paid_total : installment.amount_paid_total || '',
    amount_to_pay_total : installment.amount_to_pay_total || 0,
    installment_start_date : installment.installment_start_date || 0,
    installment_end_date : installment.installment_end_date || '',    
    payment_status: installment.payment_status || '',
    user_id: installment.user_id || 0,
    });
    setShowAddInstallmentModal(true);
  };

  // Open add installment modal
  const openAddInstallmentModal = () => {
    seteditingInstallment(null);
    setFormData({
            id_installment: 0,
    vehicle : '',
    installment_total_number : 0,
    installment_paid_number : 0,    
    amount_paid_total : '',
    amount_to_pay_total : 0,
    installment_start_date : 0,
    installment_end_date : '',    
    payment_status: '',
    user_id: 0
    });
    setShowAddInstallmentModal(true);
  };

  // Submit installment form
  const submitInstallmentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingInstallment?.id_installment || null,
        user_id : user.id
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingInstallment ? `${apiurl}/installments/` : `${apiurl}/installments/`;
      const method = editingInstallment ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Installment ${editingInstallment ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddInstallmentModal(false);
        fetchInstallments(pagination?.current_page || 1, searchInput);
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
          await axios.delete(`${apiurl}/insurance/installments`, {
            
            params: { user_id : user.id ,id: id },
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  },
});
          Swal.fire('Deleted!', 'The installment has been deleted.', 'success');
          fetchInstallments(pagination?.current_page || 1, searchInput);
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
                <h3 className="mb-0">Installments</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                        {/*}
                      <button className="btn btn-primary me-2" onClick={openAddInstallmentModal}>
                        + Add Installment
                      </button>/*/}
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
                            <th>Installment number</th>
                            <th>Installment Amount</th>
                            <th>Period</th>
                            <th>payment status</th>
                            <th>installment type</th>
                            <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {installments.length > 0 ? (
                          installments.map(installment => (
                            <tr key={installment.id_installment}>
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
                                <td>{installment.installment_paid_number}/{installment.installment_total_number}</td>
                                <td>{installment.amount_paid_total}/{installment.amount_to_pay_total}</td> 
                                <td>{installment.installment_start_date}--{installment.installment_end_date}</td>
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
                                  onClick={() => confirmDelete(installment.id_installment)}
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

      {/* Add/Edit Installment Modal */}
      {/*showAddInstallmentModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingInstallment ? 'Edit Installment' : 'Add Installment'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddInstallmentModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitInstallmentForm}>
                  <input type="hidden" name="id" value={editingInstallment?.pk || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Installment name</label>
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
                      {editingInstallment ? 'Update' : '+ Submit'} Installment
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

      {/* Add Installment Type Modal */}
     
    </div>
  );
};

export default Installments;