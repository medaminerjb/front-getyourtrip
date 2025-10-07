import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface CompanyType {
  id: number;
  name: string;
  description?: string;
}

interface Company {
    id: number;
    name: string;
    agent_name?: string;
    agent_contact?: string;
    tenant?: number;
    user_id: number;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const IntallmentCompanies: React.FC = () => {
  // State declarations
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddCompanyModal, setShowAddCompanyModal] = useState<boolean>(false);
  const [editingCompany, seteditingCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    agent_name: '',
    agent_contact: '',
    user_id: user ? user.id : null,
    tenant : user ? user.tenant : null,
  });

  // Fetch companies
  const fetchCompanies = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/installments/companies/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Companies API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setCompanies(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.companies)) {
        // If the response has an companies property
        setCompanies(response.data.companies);
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
      console.error('Error fetching companies:', error);
      Swal.fire('Error!', 'Failed to fetch companies.', 'error');
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

  // Open edit company modal
  const openEditCompanyModal = (company: Company) => {
    seteditingCompany(company);


    setFormData({
        id: company.id || 0,
      name: company.name.toString(),
      agent_name: company.agent_name || '',
      agent_contact: company.agent_contact || '',
        user_id: company.user_id || null,
        tenant : company.tenant || null,
    });
    setShowAddCompanyModal(true);
  };

  // Open add company modal
  const openAddCompanyModal = () => {
    seteditingCompany(null);
    setFormData({
      id: 0,
      name: '',
      agent_name: '',
      agent_contact: '',
        user_id: user ? user.id : null,
        tenant : user ? user.tenant : null,
    });
    setShowAddCompanyModal(true);
  };

  // Submit company form
  const submitCompanyForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingCompany?.id || null,
        tenant: user ? user.tenant : null,
      };
             const apiurl = import.meta.env.VITE_API_URL;
      console.log('Submitting company form with payload:', payload);
      const url = editingCompany ? `${apiurl}/installments/companies/` : `${apiurl}/installments/companies/`;
      const method = editingCompany ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Company ${editingCompany ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddCompanyModal(false);
        fetchCompanies(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save company.', 'error');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      Swal.fire('Error!', 'Failed to save company.', 'error');
    }
  };

  // Delete company
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
          await axios.delete(`/api/companies/${id}/`);
          Swal.fire('Deleted!', 'The company has been deleted.', 'success');
          fetchCompanies(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting company:', error);
          Swal.fire('Error!', 'Failed to delete the company.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting company type
      // Similar to submitCompanyForm but for company types
      
      
    } catch (error) {
      console.error('Error saving company type:', error);
      Swal.fire('Error!', 'Failed to save company type.', 'error');
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
                <h3 className="mb-0">Companies</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddCompanyModal}>
                        + Add Company
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
                          <th>Agent Name</th>
                          <th>Agent Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companies.length > 0 ? (
                          companies.map(company => (
                            <tr key={company.id}>
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
                                      <a href="#!" className="text-inherit">{company.name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{company.agent_name}</td>
                              <td>
                                {company.agent_contact}
                              </td>
                           
                              {company.user_id && (user.id == company.user_id || user.is_superuser) ? (
 <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditCompanyModal(company)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(company.id)}
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
                              No company found
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

      {/* Add/Edit Company Modal */}
      {showAddCompanyModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingCompany ? 'Edit Company' : 'Add Company'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddCompanyModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitCompanyForm}>
                  <input type="hidden" name="id" value={editingCompany?.id || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Company name</label>
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
                    <label className="form-label">Agent name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      name="agent_name"
                      value={formData.agent_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Agent Contact</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter duration"
                      name="agent_contact"
                      value={formData.agent_contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
               
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingCompany ? 'Update' : '+ Submit'} Company
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddCompanyModal(false)}
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

      {/* Add Company Type Modal */}
     
    </div>
  );
};

export default IntallmentCompanies;