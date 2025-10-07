import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from "react-router-dom";

// Define TypeScript interfaces
interface TripType {
    pk: number;
    name: string;
    description?: string;
}

interface Trip {
    id_activity: number;
    name : string;
    activity_type : string;
    days_count : number;
    hours_count : number;
    destination : string;
    tenant : number;
    user_id: number;
}


interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Activities: React.FC = () => {
    // State declarations
    const location = useLocation();
    const path = location.pathname;
    const typeactivity = path.includes('trip') ? 'Trips' : 'Transfers';
    const [trips, setActivities] = useState<Trip[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [searchInput, setSearchInput] = useState<string>('');
    const [showAddTripModal, setShowAddTripModal] = useState<boolean>(false);
    const [editingTrip, seteditingTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    const apiurl = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    id_activity: 0,
    name : '',
    duration_type:'',
    duration :0,
    distance:0,
    destination:''
  });

  // Fetch trips
  const fetchActivities = useCallback(async (type:string='',page: number = 1, search: string = '') => {
           const apiurl = import.meta.env.VITE_API_URL;
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
      const response = await axios.get(`${apiurl}/activities/${type}/`, {
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
        setActivities(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.activities)) {
        // If the response has an trips property
        setActivities(response.data.activities);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setActivities([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      Swal.fire('Error!', 'Failed to fetch trips.', 'error');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);



  // Initial data loading
  useEffect(() => {
    const type = location.pathname.split("/").pop();
    fetchActivities(type,1);
  }, [location.pathname]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    const type = location.pathname.split("/").pop();
    fetchActivities(type,1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
        const type = location.pathname.split("/").pop();
      fetchActivities(type,page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit trip modal
  const openEditTripModal = (trip: Trip) => {
    seteditingTrip(trip);


    setFormData({
        id_activity : trip.id_activity,
        name : trip.name,
        duration_type : trip.hours_count ? 'hours' : 'days',
        duration : trip.hours_count ? trip.hours_count : trip.days_count,
        distance : 0,
        destination : trip.destination,
    });
    setShowAddTripModal(true);
  };

  // Open add trip modal
  const openAddTripModal = () => {
    seteditingTrip(null);
    setFormData({
        id_activity : 0,
        name : '',
        duration_type :'',
        duration :0,
        distance :0,
        destination:''
        
    });
    setShowAddTripModal(true);
  };

  // Submit trip form
  const submitTripForm = async (e: React.FormEvent) => {
    e.preventDefault();
        const type = location.pathname.split("/").pop();
    try {
      const payload = {
        ...formData,
        id_activity: editingTrip?.id_activity || null,
        user_id : user.id
      };
             const apiurl = import.meta.env.VITE_API_URL;
   
      const url = editingTrip ? `${apiurl}/activities/${type}/` : `${apiurl}/activities/${type}/`;
      const method = editingTrip ? 'put' : 'post';
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Trip ${editingTrip ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddTripModal(false);
        const type = location.pathname.split("/").pop();
        fetchActivities(type,pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save trip.', 'error');
      }
    } catch (error) {
      console.error('Error saving trip:', error);
      Swal.fire('Error!', 'Failed to save trip.', 'error');
    }
  };

  // Delete trip
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
      const type = location.pathname.split("/").pop();
      if (result.isConfirmed) {
        try {
          await axios.delete(`${apiurl}/activites/${type}/`, {
            
            params: { user_id : user.id ,id: id },
  headers: {
    Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
  },
});
          Swal.fire('Deleted!', 'The trip has been deleted.', 'success');
          fetchActivities(type,pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting trip:', error);
          Swal.fire('Error!', 'Failed to delete the trip.', 'error');
        }
      }
    });
  };


  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting trip type
      // Similar to submitTripForm but for trip types
      
      
    } catch (error) {
      console.error('Error saving trip type:', error);
      Swal.fire('Error!', 'Failed to save trip type.', 'error');
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
                <h3 className="mb-0">{typeactivity}</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                        {
                      <button className="btn btn-primary me-2" onClick={openAddTripModal}>
                        + Add Trip
                      </button>}
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
                            <th>name</th>
                            <th>activity type</th>
                            <th>duration</th>
                            <th>destination</th>
                            <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trips.length > 0 ? (
                          trips.map(trip => (
                            <tr key={trip.id_activity}>
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
                                      <a href="#!" className="text-inherit">{trip.name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                                <td>{trip.activity_type}</td>
                                <td>{trip.days_count} {trip.hours_count}</td> 
                                <td>{trip.destination}</td>
                              {user.tenant == trip.tenant || user.is_superuser ? (
 <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditTripModal(trip)}
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(trip.id_activity)}
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
                              No trip found
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

      {/* Add/Edit Trip Modal */}
      {showAddTripModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingTrip ? 'Edit Trip' : 'Add Trip'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddTripModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitTripForm}>
                  <input type="hidden" name="id" value={editingTrip?.id_activity || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Trip name</label>
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
                  <div className='mb-3'>
                    <label className='form-label'>Duration Type</label>
                    <select
                    className='form-select'
                    name="duration_type"
                    value={formData.duration_type}
                    onChange={handleInputChange}
                    >
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                  </div>
          
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                    type='number'
                      className="form-control"
                      placeholder="Enter Duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />

                  </div>

                  <div className="mb-3">
                    <label className="form-label">Distance</label>
                    <input
                    type='number'
                      className="form-control"
                      placeholder="Enter Distance"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      required
                    />

                  </div>
            
                  <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input
                    type='text'
                      className="form-control"
                      placeholder="Enter destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />

                  </div>
               
           
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary me-1">
                      {editingTrip ? 'Update' : '+ Submit'} Trip
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddTripModal(false)}
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

      {/* Add Trip Type Modal */}
     
    </div>
  );
};

export default Activities;