import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface GuideModalProps {
  show: boolean;
  handleClose: () => void;
  GetGuides:() => void;
}

interface GuideFormData {
    guideFullName : string;
    phoneMobile : string;
    email : string;
    guideIdNo : string;
    tenant : string;
    etat : string;
    bateOfBirth:string;
    idNumber:number;
    cnss_number:string;
    user:number;
}

const GuideModal: React.FC<GuideModalProps> = ({ show, handleClose,GetGuides }) => {
   const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const [formData, setFormData] = useState<GuideFormData>({

    guideFullName: '',
    phoneMobile: '',
    email: '',
    guideIdNo: '',
    bateOfBirth: '',
    idNumber:0,
    cnss_number: '',
    etat: 'active',
    tenant: user.tenant,
      user:0
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
      const response = await axios.post(`${apiurl}/guides/`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
        Swal.fire('Success!', `✅ Guide submitted successfully!`, 'success');
      setFormData({
    guideFullName: '',
    phoneMobile: '',
    email: '',
    guideIdNo: '',
      bateOfBirth: '',
      idNumber:0,
      cnss_number: '',
    etat: 'active',
    tenant: user.tenant,
          user:0
      });
      GetGuides();
      handleClose();
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', `❌ Error submitting Guide`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Guide</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>guide Full Name</Form.Label>
            <Form.Control
              type="text"
              name="guideFullName"
              value={formData.guideFullName}
              onChange={onChange}
              required
              placeholder="guideFullName ..."
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
            <Form.Label>guide id number</Form.Label>
            <Form.Control
              type="number"
              name="idNumber"
              value={formData.idNumber}
              onChange={onChange}
              required
            />
          </Form.Group>
         <Form.Group className="mb-3">
            <Form.Label>guide conduit number</Form.Label>
            <Form.Control
              type="number"
              name="guideIdNo"
              value={formData.guideIdNo}
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

export default GuideModal;
