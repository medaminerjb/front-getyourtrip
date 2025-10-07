import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface ActivityTripModelProps {
  show: boolean;
  handleClose: () => void;
  GetActivites:() => void;
}

interface TripFormData {
    
    destination : string;
    distance : number;
    duration:number;
    duration_type:string;
    name:string;
    tenant:number;
    user_id:number;
}

const ActivityTripModel: React.FC<ActivityTripModelProps> = ({ show, handleClose,GetActivites }) => {
   const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [formData, setFormData] = useState<TripFormData>({

    destination : '',
    distance : 0,
    duration:0,
    duration_type:'',
    name:'',
     tenant: user.tenant,
          user_id:user.id
  });

  const [loading, setLoading] = useState(false);
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
      const response = await axios.post(`${apiurl}/activities/trip/`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
        Swal.fire('Success!', `✅ Trip submitted successfully!`, 'success');
      setFormData({
 
    destination : '',
    distance : 0,
    duration:0,
    duration_type:'',
    name:'',
    tenant: user.tenant,
    user_id:user.id
      });
      GetActivites();
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', `❌ Error submitting Trip`, 'error');
    } finally {
      setLoading(false);
          handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Trip Name</Form.Label>
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
            <Form.Label>Duration Type</Form.Label>
            <Form.Select
              name="duration_type"
              value={formData.duration_type}
              onChange={onChange}
              required
            >
              <option value={'hours'}>hours</option>
              <option value={'days'}>days</option>

              </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={onChange}
            />
          </Form.Group>
           <Form.Group className="mb-3">
            <Form.Label>Distance</Form.Label>
            <Form.Control
              type="number"
              name="distance"
              value={formData.distance}
              onChange={onChange}
            />
          </Form.Group>
           <Form.Group className="mb-3">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              type="text"
              name="destination"
              value={formData.destination}
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onSubmit} disabled={loading}>
          {loading ? "Submitting..." : "+ Submit trip"}
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActivityTripModel;
