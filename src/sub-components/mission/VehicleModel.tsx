import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface VehicleModalProps {
  show: boolean;
  handleClose: () => void;
  handleSearch: () => void;
}

interface VehicleFormData {
  id_vehicle?: string;
  regisNumber: string;
  chassis_number: string;
  registration_date: string;
  first_circulation_date: string;
  color: string;
  model: string;
  kilometrage: number | string;
  tenant:number;
}

const VehicleModal: React.FC<VehicleModalProps> = ({ show, handleClose,handleSearch }) => {
   const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [formData, setFormData] = useState<VehicleFormData>({
    regisNumber: "",
    chassis_number: "",
    registration_date: "",
    first_circulation_date: "",
    color: "",
    model: "",
    kilometrage: "",
    tenant:user.tenant

  });

  const [loading, setLoading] = useState(false);
    const [modelvehicles,setModelVehicles] =useState<any[]>([])
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('access_token') || '';
    const fetchform = useCallback(async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
         const apiurl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiurl}/vehicle/form`, {
              params: { id: user.id ? user.id : '' ,tenant:user.tenant,activity_type:"trip"},
            headers: {
      Authorization: `Bearer ${token}`,
    },
        });
        setModelVehicles(response.data.models || []);
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
        Swal.fire('Error!', 'Failed to fetch vehicle types.', 'error');
  
      }
    }, []);
    useEffect(() => {
      fetchform();
    }, [fetchform]);
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiurl}/vehicles`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            "Content-Type": "application/json",
          },
        }
      );
 Swal.fire('Success!', `✅ Vehicle submitted successfully!`, 'success');
      setFormData({
        regisNumber: "",
        chassis_number: "",
        registration_date: "",
        first_circulation_date: "",
        color: "",
        model: "",
        kilometrage: "",
         tenant:user.tenant
      });
      handleSearch();
      handleClose();
    } catch (error) {
      console.error(error);
       Swal.fire('Error!', `❌ Error submitting vehicle`, 'error');
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
            <Form.Label>Registration number</Form.Label>
            <Form.Control
              type="text"
              name="regisNumber"
              value={formData.regisNumber}
              onChange={onChange}
              required
              placeholder="Registration number (XXXXTUNXXX)..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chassis number</Form.Label>
            <Form.Control
              type="text"
              name="chassis_number"
              value={formData.chassis_number}
              onChange={onChange}
              required
              placeholder="Chassis number here..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date registration</Form.Label>
            <Form.Control
              type="date"
              name="registration_date"
              value={formData.registration_date}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date first circulation</Form.Label>
            <Form.Control
              type="date"
              name="first_circulation_date"
              value={formData.first_circulation_date}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vehicle color</Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color}
              onChange={onChange}
              required
              placeholder="Vehicle color here..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
             <div className="d-flex justify-content-between">

            <Form.Label>Model vehicle</Form.Label>
          
             </div>
            <Form.Select
              name="model"
              value={formData.model}
              onChange={onChange}
              required
            >
              <option value="">-- Select model --</option>

                    {Array.isArray(modelvehicles) && modelvehicles.map(a => (
                        <option key={a.pk} value={a.pk}>
                          {a.model}
                        </option>
                      ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kilometrage counter</Form.Label>
            <Form.Control
              type="number"
              name="kilometrage"
              value={formData.kilometrage}
              onChange={onChange}
              required
              placeholder="Kilometrage counter here..."
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

export default VehicleModal;
