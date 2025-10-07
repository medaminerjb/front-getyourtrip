import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface ActivityType {
  pk: number;
  name: string;
  description?: string;
}

interface Activity {
  pk: number;
  name: string;
  activity_type: number;
  activity_type_name?: string;
  days_count?: number;
  hours_count?: number;
  duration_type: 'hours' | 'days';
  duration: number;
  distance: number;
  destination: string;
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState<boolean>(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingType, setEditingType] = useState<ActivityType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: '',
    activity_type: '',
    duration_type: 'hours' as 'hours' | 'days',
    duration: '',
    distance: '',
    destination: ''
  });

  // Fetch activities
  const fetchActivities = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const response = await axios.get('/api/activities/', {
        params: { page, search }
      });
      
      // Log the response to understand its structure
      console.log('Activities API response:', response.data);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        // If the response is directly an array
        setActivities(response.data);
        setPagination({
          current_page: 1,
          total_pages: 1,
          current_range_start: 1,
          current_range_end: response.data.length,
          total_results: response.data.length
        });
      } else if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setActivities(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.activities)) {
        // If the response has an activities property
        setActivities(response.data.activities);
        setPagination(response.data.pagination || null);
      } else {
        // Fallback: set empty array
        setActivities([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      Swal.fire('Error!', 'Failed to fetch activities.', 'error');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch activity types
  const fetchActivityTypes = useCallback(async () => {
    try {
      const response = await axios.get('/api/activity-types/');
      
      // Log the response to understand its structure
      console.log('Activity Types API response:', response.data);
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        setActivityTypes(response.data);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        setActivityTypes(response.data.results);
      } else if (Array.isArray(response.data.activity_types)) {
        setActivityTypes(response.data.activity_types);
      } else if (Array.isArray(response.data.types)) {
        setActivityTypes(response.data.types);
      } else if (response.data.activites && Array.isArray(response.data.activites)) {
        // Based on your Django template code
        setActivityTypes(response.data.activites);
      } else {
        console.error('Unexpected activity types response structure:', response.data);
        setActivityTypes([]);
      }
    } catch (error) {
      console.error('Error fetching activity types:', error);
      Swal.fire('Error!', 'Failed to fetch activity types.', 'error');
      setActivityTypes([]);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchActivities(1);
    fetchActivityTypes();
  }, [fetchActivities, fetchActivityTypes]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchActivities(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchActivities(page, searchInput);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit activity modal
  const openEditActivityModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      activity_type: activity.activity_type.toString(),
      duration_type: activity.duration_type,
      duration: activity.duration.toString(),
      distance: activity.distance.toString(),
      destination: activity.destination
    });
    setShowAddActivityModal(true);
  };

  // Open add activity modal
  const openAddActivityModal = () => {
    setEditingActivity(null);
    setFormData({
      name: '',
      activity_type: '',
      duration_type: 'hours',
      duration: '',
      distance: '',
      destination: ''
    });
    setShowAddActivityModal(true);
  };

  // Submit activity form
  const submitActivityForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        id: editingActivity?.pk || null
      };
      
      const url = editingActivity ? `/api/activities/${editingActivity.pk}/` : '/api/activities/';
      const method = editingActivity ? 'put' : 'post';
      
      const response = await axios[method](url, payload);
      
      if (response.data.success) {
        Swal.fire('Success!', `Activity ${editingActivity ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddActivityModal(false);
        fetchActivities(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save activity.', 'error');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      Swal.fire('Error!', 'Failed to save activity.', 'error');
    }
  };

  // Delete activity
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
          Swal.fire('Deleted!', 'The activity has been deleted.', 'success');
          fetchActivities(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting activity:', error);
          Swal.fire('Error!', 'Failed to delete the activity.', 'error');
        }
      }
    });
  };

  // Open add type modal
  const openAddTypeModal = () => {
    setEditingType(null);
    setShowAddTypeModal(true);
  };

  // Submit type form
  const submitTypeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Implementation for submitting activity type
      // Similar to submitActivityForm but for activity types
      
      setShowAddTypeModal(false);
      fetchActivityTypes(); // Refresh the types list
    } catch (error) {
      console.error('Error saving activity type:', error);
      Swal.fire('Error!', 'Failed to save activity type.', 'error');
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
                      <button className="btn btn-primary me-2" onClick={openAddActivityModal}>
                        + Add Activity
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
                          <th>Activity Type</th>
                          <th>Duration</th>
                          <th>Destination</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.length > 0 ? (
                          activities.map(activity => (
                            <tr key={activity.pk}>
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
                                      <a href="#!" className="text-inherit">{activity.name}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{activity.activity_type_name}</td>
                              <td>
                                {activity.duration_type === 'days' 
                                  ? `${activity.duration} days` 
                                  : `${activity.duration} hours`}
                              </td>
                              <td>{activity.destination}</td>
                              <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="bi bi-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => openEditActivityModal(activity)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(activity.pk)}
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

      {/* Add/Edit Activity Modal */}
      {showAddActivityModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">
                  {editingActivity ? 'Edit Activity' : 'Add Activity'}
                </h4>
                <button type="button" className="btn-close" onClick={() => setShowAddActivityModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitActivityForm}>
                  <input type="hidden" name="id" value={editingActivity?.pk || ''} />
                  <div className="mb-3">
                    <label htmlFor="activiteName" className="form-label">Activity name</label>
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
                    <div className="d-flex justify-content-between">
                      <label className="form-label">Activity type</label>
                      <a href="#!" className="btn-link fw-semi-bold" onClick={openAddTypeModal}>
                        Add New
                      </a>
                    </div>
                    <select
                      className="form-select"
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select type</option>
                      {Array.isArray(activityTypes) && activityTypes.map(type => (
                        <option key={type.pk} value={type.pk}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration type</label>
                    <select
                      className="form-select"
                      name="duration_type"
                      value={formData.duration_type}
                      onChange={handleInputChange}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Distance</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter distance"
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Destination</label>
                    <input
                      type="text"
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
                      {editingActivity ? 'Update' : '+ Submit'} Activity
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => setShowAddActivityModal(false)}
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

      {/* Add Activity Type Modal */}
      {showAddTypeModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Activity Type</h4>
                <button type="button" className="btn-close" onClick={() => setShowAddTypeModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={submitTypeForm}>
                  <input type="hidden" name="id" value={editingType?.pk || ''} />
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
    </div>
  );
};

export default Activities;