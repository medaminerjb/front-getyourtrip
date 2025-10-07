import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces


interface Vehicle {
  id_vehicle: number;
  regisNumber: string;
  model_name: string;
  color: string;
  type: string;
  available: string;

}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Vehicles: React.FC = () => {
  // State declarations
  const [vehicles, setVehicle] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const apiurl = import.meta.env.VITE_API_URL;

  // Fetch Vehicles
 const fetchVehicles = useCallback(async (page: number = 1, search: string = '') => {
  try {
    setLoading(true);
    const token = localStorage.getItem("access_token");
  const response = await axios.get(`${apiurl}/vehicles`, {
  params: { page, search },
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    console.log('Vehicles API response:', response.data);

    // DRF pagination style response
    if (response.data.results && Array.isArray(response.data.results)) {
      setVehicle(response.data.results);

      // Build pagination object compatible with your UI
   setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

    } else if (Array.isArray(response.data.vehicles)) {
      // In case backend sends custom {"vehicles": [...], "total_results": ...}
      setVehicle(response.data.vehicles);
  setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

    } else {
      // Fallback
      setVehicle([]);
      setPagination(null);
    }

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    Swal.fire('Error!', 'Failed to fetch vehicles.', 'error');
    setVehicle([]);
    setPagination(null);
  } finally {
    setLoading(false);
  }
}, [apiurl]);


  // Fetch vehicle types


  // Initial data loading
  useEffect(() => {
    fetchVehicles(1);
  }, [fetchVehicles]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
      };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchVehicles(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchVehicles(page, searchInput);
    }
  };




  // Submit vehicle form


  // Delete vehicle
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
        const token = localStorage.getItem("access_token");

        try {
          await axios.delete(`${apiurl}/vehicle/${id}/delete`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
          Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
          fetchVehicles(pagination?.current_page || 1, searchInput);
        } catch (error) {
          console.error('Error deleting vehicle:', error);
          Swal.fire('Error!', 'Failed to delete the vehicle.', 'error');
        }
      }
    });
  };

  // Open add type modal




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
                <h3 className="mb-0">Vehicles</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2"  >
                        + Add Vehicle
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
                          <th>Registration Number</th>
                          <th>Model</th>
                          <th>Color</th>
                          <th>Vehicle Type</th>
                            <th>Available</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.length > 0 ? (
                          vehicles.map(vehicle => (
                            <tr key={vehicle.id_vehicle}>
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
                                      <a href="#!" className="text-inherit">{vehicle.regisNumber}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{vehicle.model_name}</td>
                              <td>
                                {vehicle.color}
                              </td>
                              <td>{vehicle.type}</td>
                              <td>{vehicle.available}</td>

                              <td>
                                <a className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip">
                                  <i className="fe fe-eye"></i>
                                </a>
                                <a
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                >
                                  <i className="fe fe-edit"></i>
                                </a>
                                <button
                                  className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                  onClick={() => confirmDelete(vehicle.id_vehicle)}
                                >
                                  <i className="fe fe-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No Vehicles found
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

    </div>
  );
};

export default Vehicles;