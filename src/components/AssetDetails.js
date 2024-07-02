import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import firebaseApp from "../credenciales";
import { getFirestore, updateDoc, doc } from "firebase/firestore";

const firestore = getFirestore(firebaseApp);

const AssetDetails = ({ show, handleClose, selectedAsset, correoUsuario, setArrayContenido, arrayContenido }) => {
  const [descripcion, setDescripcion] = useState(selectedAsset.descripcion);
  const [tipo, setTipo] = useState(selectedAsset.tipo);

  const handleSaveChanges = async () => {
    const updatedContent = arrayContenido.map((item) => {
      if (item.id === selectedAsset.id) {
        return { ...item, descripcion, tipo };
      }
      return item;
    });

    const docuRef = doc(firestore, `usuarios/${correoUsuario}`);
    await updateDoc(docuRef, { contenido: updatedContent });
    setArrayContenido(updatedContent);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Activo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo de Archivo</Form.Label>
            <Form.Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="text">Texto</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Imagen</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssetDetails;
