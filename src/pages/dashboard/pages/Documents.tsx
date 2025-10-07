import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Define TypeScript interfaces
interface TypeVehicle {
  type_id: number;
  type: string;
  description?: string;
}
interface Document{
    pk?: number;
    id_document : number;
    document_type_id : number;
    matricule : string;
    document_number : number;
    type : string;
    issue_date : string;
    expiration_date : string;
    last_updated : string;
    file: string;
    file_file : File;
    email : string;
}




interface PaginationInfo {
  current_page: number;
  total_pages: number;
  current_range_start: number;
  current_range_end: number;
  total_results: number;
}

const Documents: React.FC = () => {
  // State declarations
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [documenttypes, setDocumentTypes] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [showAddDocument, setShowAddDocument] = useState<boolean>(false);
  const [editingDocument, seteditingDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
const [brandForm, setBrandForm] = useState({
  name: "",
  country: "",
  founded_year: "",
  website: ""
});
  const [formData, setFormData] = useState({
    pk: 0,
    document_number: 0,
    vehicle: '',
    document_type: '',
    issue_date: '',
    expiration_date: '',
    file: '',
    email: '',
    matricule: '',
    file_file: null as File | null,
    document_type_id: 0,
  });

  // Fetch document
  const fetchDocuments = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || '';
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/documents/`, {
        params: { page, search },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      
      // Log the response to understand its structure
      console.log('Documents API response:', response.data);
      
      // Handle different response structures
  if (response.data.results && Array.isArray(response.data.results)) {
        // If the response has a results property
        setDocuments(response.data.results);
        setPagination(response.data.pagination || null);
      } else if (Array.isArray(response.data.documents)) {
        // If the response has an document property
        setDocuments(response.data.documents);
         setPagination({
  current_page: response.data.current_page,
  total_pages: response.data.total_pages,
  current_range_start: response.data.current_range_start,
  current_range_end: response.data.current_range_end,
  total_results: response.data.total_results
});

      } else {
        // Fallback: set empty array
        setDocuments([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      Swal.fire('Error!', 'Failed to fetch document.', 'error');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchformdocument = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
       const apiurl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiurl}/vehicle/document/form`, {
            params: { id: user.id ? user.id : '' },
          headers: {
    Authorization: `Bearer ${token}`,
  },
      });
      setVehicles(response.data.vehicles || []);
      setDocumentTypes(response.data.document_types || []);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
      setVehicles([]);
      setDocumentTypes([]);
    }
  }, []);

  // Fetch vehicle types on component mount
  
  
  // Initial data loading
  useEffect(() => {
    fetchformdocument();
    fetchDocuments(1);
  }, [fetchDocuments, fetchformdocument]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    fetchDocuments(1, searchInput);
  };

  // Handle pagination click
  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      fetchDocuments(page, searchInput);
    }
  };

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

  // Open edit model modal


  // Open add model modal
  const openAddDocumentModal = () => {
    seteditingDocument(null);
    setFormData({
     pk:  0,
    document_number:  0,
    vehicle: '',
    document_type: '',
    issue_date:  '',
    expiration_date:  '',
    file:  '',
    email:'',
    matricule: '',
    file_file: null,
    document_type_id: 0,
    });
    setShowAddDocument(true);
  };

  // Submit model form
  const submitDocumentForm = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data to submit:', formData);
    try {
      const payload = {
        ...formData,
        file: formData.file, // assuming file_file is the correct field for file upload
        id: editingDocument?.pk || null
      };
             const apiurl = import.meta.env.VITE_API_URL;
      console.log('Submitting model form with payload:', editingDocument);
      const url = editingDocument ? `${apiurl}/documents/${editingDocument.pk}/` : `${apiurl}/documents/`;
      const method = editingDocument ? 'put' : 'post';
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
      const token = localStorage.getItem('access_token') || '';
      const response = await axios[method](url, payload, {
    params : { id: user.id ? user.id : '' },
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type":  "multipart/form-data",
  },
});
      
      if (response.data.success) {
        Swal.fire('Success!', `Document ${editingDocument ? 'updated' : 'added'} successfully.`, 'success');
        setShowAddDocument(false);
        fetchDocuments(pagination?.current_page || 1, searchInput);
      } else {
        Swal.fire('Error!', 'Failed to save model.', 'error');
      }
    } catch (error) {
      console.error('Error saving model:', error);
      Swal.fire('Error!', 'Failed to save model.', 'error');
    }
  };

  // Delete model


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
                <h3 className="mb-0">Documents</h3>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <div className="row justify-content-between">
                    <div className="col-md-6 mb-3">
                      <button className="btn btn-primary me-2" onClick={openAddDocumentModal}>
                        + Add Document
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
                                    <th className="ps-1">Matricuel</th>
                                    <th>Document Number</th>
                                    <th>issue date</th>
                                    <th>expiration date</th>
                                    <th>Last Update</th>
                                    <th>Options</th>
                                    <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.length > 0 ? (
                          documents.map(document => (
                            <tr key={document.id_document}>
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
                                      <a href="#!" className="text-inherit">{document.matricule}</a>
                                    </h5>
                                  </div>
                                </div>
                              </td>
                              <td>{document.document_number}</td>
                              <td>{document.type}</td>
                              <td>
                                {document.issue_date}
                              </td>
                              <td>{document.expiration_date}</td>
                              <td>{document.last_updated}</td>
                                { document.file && (
                                  <a href={`${document.file}`}
                                                        className="btn btn-ghost btn-icon btn-sm rounded-circle texttooltip"
                                                        data-template="five" target="_blank">
   <i className="fe fe-file"></i>
                                                        <div id="five" className="d-none">
                                                            <span>Download</span>
                                                        </div>
                                                    </a>
                                )

                                }
                               
                                
                       
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-4">
                              No document found
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

      {/* Add/Edit Document Modal */}
{showAddDocument && (
  <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">
            {editingDocument ? 'Edit Document' : 'Add Document'}
          </h4>
          <button type="button" className="btn-close" onClick={() => setShowAddDocument(false)}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={submitDocumentForm}>
            <input type="hidden" name="id" value={editingDocument?.pk || ''} />

            {/* Document Number */}
            <div className="mb-3">
              <label className="form-label">Document Number</label>
              <input
                type="text"
                className="form-control"
                name="document_number"
                placeholder="Enter document number"
                value={formData.document_number}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Document Type */}
            <div className="mb-3">
              <label className="form-label">Document Type</label>
              <select
                className="form-select"
                name="document_type_id"
                value={formData.document_type_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select type</option>
                {documenttypes.map((type) => (
                  <option key={type.pk} value={type.pk}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle */}
            <div className="mb-3">
              <label className="form-label">Vehicle</label>
              <select
                className="form-select"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
                required
              >
                <option value="">Select vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.pk} value={vehicle.pk}>
                    {vehicle.regisNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Issue Date */}
            <div className="mb-3">
              <label className="form-label">Issue Date</label>
              <input
                type="date"
                className="form-control"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Expiration Date */}
            <div className="mb-3">
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                className="form-control"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <label className="form-label">Document File</label>
              <input
                type="file"
                className="form-control"
                name="file"
                 onChange={(e) =>
      setFormData({ ...formData, file: e.target.files?.[0] || null })
    }
                required
              />
            </div>

            {/* Buttons */}
            <div className="text-end">
              <button type="submit" className="btn btn-primary me-1">
                {editingDocument ? 'Update' : '+ Submit'} Document
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setShowAddDocument(false)}
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

   
      {/* Add Document Type Modal */}
     
    </div>
  );
};

export default Documents;