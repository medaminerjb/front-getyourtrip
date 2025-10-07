import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface DriverType {
  pk: number;
  name: string;
  description?: string;
}


interface Driver {
    id_driver : number;
    driverFullName : string;
    phoneMobile : string;
    email : number;
    driverIdNo : string;
    created : number;
    tenant : string;
    user_id : string;
    etat : string;
    bateOfBirth:string;
    idNumber:number;
    cnss_number:string;

}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Drivers: React.FC = () => {
  // State declarations
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddDriverModal, setShowAddDriverModal] = useState<boolean>(false);
  const [editingDriver, seteditingDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    id_driver: '',
    driverFullName: '',
    phoneMobile: '',
    email: '',
    driverIdNo: '',
      bateOfBirth: '',
      idNumber:0,
      cnss_number: '',
    etat: 'active',
    tenant: '',

  });

  // Fetch activities
  const fetchDrivers = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/users/drivers/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Drivers API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setDrivers(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.drivers)) {
        // If the response has an activities property
        setDrivers(response.data.drivers);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setDrivers([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // Initial data loading
  useEffect(() => {
    fetchDrivers(1);
  }, [fetchDrivers]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchDrivers(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchDrivers(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit driver modal
  const openEditDriverModal = (driver: Driver) => {
    seteditingDriver(driver);


    setFormData({
        id_driver: driver.id_driver.toString(),
        driverFullName: driver.driverFullName,
        phoneMobile: driver.phoneMobile,
        email: driver.email.toString(),
        driverIdNo: driver.driverIdNo,
        bateOfBirth: driver.bateOfBirth,
        idNumber: driver.idNumber,
        cnss_number: driver.cnss_number,
        etat: driver.etat,
        tenant: driver.tenant || '',

    });
    setShowAddDriverModal(true);
  };

  // Open add driver modal
  const openAddDriverModal = () => {
    seteditingDriver(null);
    setFormData({
        id_driver: '',
        driverFullName: '',
        phoneMobile: '',
        email: '',
        driverIdNo: '',
            bateOfBirth: '',
        idNumber: 0,
        cnss_number: '',
        etat: 'active',
        tenant: '',
    });
    setShowAddDriverModal(true);
  };

  // Submit driver form
  const submitDriverForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingDriver?.id_driver || null,
        tenant : user.tenant,
        user:0
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingDriver ? `${apiurl}/users/drivers/${editingDriver.id_driver}/` : `${apiurl}/users/drivers/`;
      const method = editingDriver ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Driver ${editingDriver ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddDriverModal(false);
        fetchDrivers(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save driver.', 'error');
      }
    } catch (error) {
      console.error('Error saving driver:', error);
      Swal.fire('Error!', 'Failed to save driver.', 'error');
    }
  };

  // Delete driver
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
        const apiurl =import.meta.env.VITE_API_URL; 
                  await axios.delete(`${apiurl}/users/drivers/${id}/`, {
    params : { id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').id : '' },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      "Content-Type": "application/json",
    },
  });
          
          Swal.fire('Deleted!', 'The driver has been deleted.', 'success');
          fetchDrivers(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting driver:', error);
          Swal.fire('Error!', 'Failed to delete the driver.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting driver type
      // Similar to submitDriverForm but for driver types
      
      
    } catch (error) {
      console.error('Error saving driver type:', error);
      Swal.fire('Error!', 'Failed to save driver type.', 'error');
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
                <h3 className="mb-0">Drivers</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddDriverModal}>
                        + Add Driver
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
                          <th>driver</th>
                          <th>Phone</th>
                          <th>Email</th>
                            <th>Driver ID No</th>
                            <th>Created</th>
                          <th>status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drivers.length > 0 ? (
                          drivers.map(driver => (
                            <tr key={driver.id_driver}>
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
                                      <a href="#!" className="text-inherit">{driver.driverFullName}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{driver.phoneMobile}</td>
                              <td>
                                {driver.email}
                              </td>
                                <td>{driver.driverIdNo}</td>
                              <td>{driver.created}</td>
                              <td>{driver.etat}</td>
                              <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="bi bi-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditDriverModal(driver)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(driver.id_driver)}
                                >
                                  <i className="fe fe-trash"></i>
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

      {/* Add/Edit Driver Modal */}
      {showAddDriverModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingDriver ? 'Edit Driver' : 'Add Driver'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddDriverModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitDriverForm}>
                  <input type="hidden" name="id" value={editingDriver?.id_driver || ''} />
                  <div className="form-check form-switch mb-3">
                    <input
                    type='checkbox'
                        className="form-check-input"
                        name="etat"
                        role='switch'

                        checked={formData.etat === 'active'}
                        onChange={(e) => setFormData(prev => ({ ...prev, etat: e.target.checked ? 'active' : 'inactive' }))}
                      />
                    <label htmlFor="driverType" className="fform-check-label">Driver Active status</label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Driver name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      name="driverFullName"
                      value={formData.driverFullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
          <div className="mb-3">
                    <label className="form-label">Date Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Enter Country"
                      name="bateOfBirth"
                      value={formData.bateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                      <div className="mb-3">
                    <label className="form-label">Driver Cin</label>
                      <input
    type="text"
    className="form-control"
    placeholder="Enter CIN"
    name="idNumber"
    value={formData.idNumber}
    onChange={handleInputChange}
    required
    pattern="\d{8}"
    inputMode="numeric"
  />
                  </div>
                        <div className="mb-3">
                    <label className="form-label">Driver Cnss</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      name="cnss_number"
                      value={formData.cnss_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                       <div className="mb-3">
                    <label className="form-label">Driver Conduit Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Country"
                      name="driverIdNo"
                      value={formData.driverIdNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  
            <div className="mb-3">

                    <label className="form-label">Phone Mobile</label>
                    <input
                      type="text"
                        className="form-control"
                        placeholder="Enter Phone Mobile"
                        name="phoneMobile"
                        value={formData.phoneMobile}
                        onChange={handleInputChange}
                        required
                      />
                  </div>
                              
            <div className="mb-3">

                    <label className="form-label">Email</label>
                    <input
                      type="text"
                        className="form-control"
                        placeholder="Enter Phone Mobile"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                  </div>
              
     
             
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingDriver ? 'Update' : '+ Submit'} Driver
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddDriverModal(false)}
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

      {/* Add Driver Type Modal */}
     
    </div>
  );
};

export default Drivers;