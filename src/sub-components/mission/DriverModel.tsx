import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface DriverModalProps {
  show: boolean;
  handleClose: () => void;
  handleSearch:() => void;
}

interface DriverFormData {
    driverFullName : string;
    phoneMobile : string;
    email : string;
    driverIdNo : string;
    tenant : string;
    etat : string;
    bateOfBirth:string;
    idNumber:number;
    cnss_number:string;
    user:number;
}

const DriverModal: React.FC<DriverModalProps> = ({ show, handleClose,handleSearch }) => {
   const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [formData, setFormData] = useState<DriverFormData>({

    driverFullName: '',
    phoneMobile: '',
    email: '',
    driverIdNo: '',
      bateOfBirth: '',
      idNumber:0,
      cnss_number: '',
    etat: 'active',
    tenant: user.tenant,
      user:0
  });

  const [loading, setLoading] = useState(false);
    const [modelvehicles,setModelVehicles] =useState<any[]>([])
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('access_token') || '';


  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiurl}/users/drivers/`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            "Content-Type": "application/json",
          },
        }
      );
        Swal.fire('Success!', `✅ Driver submitted successfully!`, 'success');
      setFormData({
    driverFullName: '',
    phoneMobile: '',
    email: '',
    driverIdNo: '',
      bateOfBirth: '',
      idNumber:0,
      cnss_number: '',
    etat: 'active',
    tenant: user.tenant,
          user:0
      });
      handleSearch();
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', `❌ Error submitting Driver`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>driver Full Name</Form.Label>
            <Form.Control
              type="text"
              name="driverFullName"
              value={formData.driverFullName}
              onChange={onChange}
              required
              placeholder="driverFullName ..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date birth</Form.Label>
            <Form.Control
              type="date"
              name="bateOfBirth"
              value={formData.bateOfBirth}
              onChange={onChange}
              required
              placeholder="Chassis number here..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>driver id number</Form.Label>
            <Form.Control
              type="number"
              name="idNumber"
              value={formData.idNumber}
              onChange={onChange}
              required
            />
          </Form.Group>
         <Form.Group className="mb-3">
            <Form.Label>driver conduit number</Form.Label>
            <Form.Control
              type="number"
              name="driverIdNo"
              value={formData.driverIdNo}
              onChange={onChange}
              required
            />
          </Form.Group>
             <Form.Group className="mb-3">
            <Form.Label>Phone Mobile</Form.Label>
            <Form.Control
              type="number"
              name="phoneMobile"
              value={formData.phoneMobile}
              onChange={onChange}
              required
            />
          </Form.Group>
                <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSubmit} disabled={loading}>
          {loading ? "Submitting..." : "+ Submit vehicle"}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverModal;
