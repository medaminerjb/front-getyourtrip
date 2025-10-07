import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Modal, Button, Form } from "react-bootstrap";

interface ModelVehicleProps {
  show: boolean;
  handleClose: () => void;
}


interface Model {
id_model: number ;
model: string;
puissanceA : number ;
puissanceM : number ;
bvitesse : string ;
reservoir : string;
typec : string;
type : string;
place : number;
bauto : string;
brand: string;
public?: boolean;

}
const ModalVehicle: React.FC<ModelVehicleProps> = ({ show, handleClose }) => {
  const [formData, setFormData] = useState<Model>({
    id_model: 0 ,
model: '',
puissanceA : 0,
puissanceM : 0,
bvitesse : '',
reservoir : '',
typec : '',
type : '',
place : 0,
bauto : '',
brand: '',
public: false
  });

  const [loading, setLoading] = useState(false);
    const [modelvehicles,setModelVehicles] =useState<any[]>([]);
    const [brands,setBrands] =useState<any[]>([]);
    const [vehicletypes,setVehicleTypes] = useState<any[]>([]);
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('access_token') || '';
    const fetchform = useCallback(async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : {};
         const apiurl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiurl}/vehicle/model/form`, {
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
      const response = await axios.post(`${apiurl}/models/`,
        formData,
        {
          headers: {
             Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Vehicle submitted successfully!");
      setFormData({
     id_model: 0 ,
model: '',
puissanceA : 0,
puissanceM : 0,
bvitesse : '',
reservoir : '',
typec : '',
type : '',
place : 0,
bauto : '',
brand: '',
public: false
      });
      handleClose();
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Model Vehicle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Model name</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={onChange}
              required
              placeholder="Model name..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Puissance administrative</Form.Label>
            <Form.Control
              type="number"
              name="puissanceA"
              value={formData.puissanceA}
              onChange={onChange}
              required
              placeholder="Chassis number here..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Puissance moteur</Form.Label>
            <Form.Control
              type="number"
              name="puissanceM"
              value={formData.puissanceM}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date first circulation</Form.Label>
            <Form.Select
              name="bauto"
              value={formData.bauto}
              onChange={onChange}
              required
            >
               <option value="">Select type</option>
                      <option value="true">Automatic</option>
                      <option value="false">Manual</option>
                </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Boite vitesse</Form.Label>
            <Form.Control
              type="number"
              name="bvitesse"
              value={formData.bvitesse}
              onChange={onChange}
              required
              placeholder="Vehicle color here..."
            />
          </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>reservoir</Form.Label>
            <Form.Control
              type="number"
              name="reservoir"
              value={formData.reservoir}
              onChange={onChange}
              required
              placeholder="Vehicle color here..."
            />
          </Form.Group>
                <Form.Group className="mb-3">
            <Form.Label>Type Carburant</Form.Label>
            <Form.Select
              name="typec"
              value={formData.typec}
              onChange={onChange}
              required
            >
               <option value="">Select type carburant</option>
                      <option value="diesel">diesel</option>
                      <option value="essence">essence</option>
                       <option value="hybride">hybride</option>
                       <option value="electrique">electrique</option>
                </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
             <div className="d-flex justify-content-between">

            <Form.Label>Brand</Form.Label>
              <a href="#!" className="btn-link fw-semi-bold" >
                      Add New
                      </a>
             </div>
            <Form.Select
              name="brand"
              value={formData.brand}
              onChange={onChange}
              required
            >
              <option value="">-- Select model --</option>

                    {Array.isArray(brands) && brands.map(brand => (
                       <option key={brand.id_brand} value={brand.id_brand}>
                          {brand.name}
                        </option>
                      ))}
            </Form.Select>
          </Form.Group>
      <Form.Group className="mb-3">
             <div className="d-flex justify-content-between">

            <Form.Label>Vehicle Type</Form.Label>
             
             </div>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={onChange}
              required
            >
              <option value="">-- Select model --</option>

                       {Array.isArray(vehicletypes) && vehicletypes.map(type => (
                        <option key={type.type_id} value={type.type_id}>
                          {type.type}
                        </option>
                      ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>number of place</Form.Label>
            <Form.Control
              type="number"
              name="place"
              value={formData.place}
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

export default ModalVehicle;


