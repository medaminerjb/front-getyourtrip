import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface AgencyModalProps {
  show: boolean;
  handleClose: () => void;
  GetAgencies:() => void;
}

interface AgencyFormData {
    name : string;
    phone_number : string;
    address : string;
    tenant:number;
    user:number;
}

const AgencyModal: React.FC<AgencyModalProps> = ({ show, handleClose,GetAgencies }) => {
   const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [formData, setFormData] = useState<AgencyFormData>({

       name : '',
    phone_number : '',
    address : '',
     tenant: user.tenant,
          user:0
  });

  const [loading, setLoading] = useState(false);
    const [modelvehicles,setModelAgencys] =useState<any[]>([])
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
      const response = await axios.post(`${apiurl}/agencies/`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            "Content-Type": "application/json",
          },
        }
      );
        Swal.fire('Success!', `✅ Agency submitted successfully!`, 'success');
      setFormData({
           name : '',
    phone_number : '',
    address : '',
    tenant: user.tenant,
          user:0
      });
      GetAgencies();
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', `❌ Error submitting Agency`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agency</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Agency Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder="name ..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phone_number"
              value={formData.phone_number}
              onChange={onChange}
              required
              placeholder="Phone Number..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Agency Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={onChange}
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

export default AgencyModal;
