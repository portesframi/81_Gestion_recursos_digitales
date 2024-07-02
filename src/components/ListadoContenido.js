import React, { useState } from "react";
import { Container, Row, Col, Button, ListGroup, ToggleButtonGroup, ToggleButton, Form } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import firebaseApp from "../credenciales";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import AssetGallery from "./AssetGallery";
import AssetDetails from './AssetDetails'; // Importar AssetDetails

const firestore = getFirestore(firebaseApp);

const ListadoContenido = ({ arrayContenido, correoUsuario, setArrayContenido }) => {
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('');
  const [show, setShow] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileTypeChange = (e) => {
    setFileTypeFilter(e.target.value);
  };

  const handleShow = (asset) => {
    setSelectedAsset(asset);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  async function eliminarContenido(idContenidoAEliminar) {
    const nvoArrayContenido = arrayContenido.filter(
      (objetoContenido) => objetoContenido.id !== idContenidoAEliminar
    );
    const docuRef = doc(firestore, `usuarios/${correoUsuario}`);
    await updateDoc(docuRef, { contenido: [...nvoArrayContenido] });
    setArrayContenido(nvoArrayContenido);
  }

  const handleViewChange = (val) => {
    setViewMode(val);
  }

  const filteredContent = arrayContenido.filter((objetoContenido) => {
    const matchesSearchTerm = searchTerm === '' || objetoContenido.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFileType = fileTypeFilter === '' || (objetoContenido.tipo && objetoContenido.tipo.toLowerCase() === fileTypeFilter.toLowerCase());
    return matchesSearchTerm && matchesFileType;
  });

  const generateEmbedCode = (url) => {
    return `<iframe src="${url}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;
  };

  return (
    <Container>
      <Form className="mb-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Select
            value={fileTypeFilter}
            onChange={handleFileTypeChange}
            aria-label="Filtrar por tipo de archivo"
            className="mt-2"
          >
            <option value="">Todos los formatos</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="text">Texto</option>
            <option value="image">Imagen</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <ToggleButtonGroup type="radio" name="viewMode" value={viewMode} onChange={handleViewChange} className="mb-3">
        <ToggleButton id="tbg-radio-1" value={'list'} variant="outline-primary">
          Lista
        </ToggleButton>
        <ToggleButton id="tbg-radio-2" value={'gallery'} variant="outline-primary">
          Galería
        </ToggleButton>
      </ToggleButtonGroup>

      {viewMode === 'list' ? (
        <ListGroup>
          {filteredContent.map((objetoContenido) => (
            <ListGroup.Item key={objetoContenido.id}>
              <Row>
                <Col>{objetoContenido.descripcion}</Col>
                <Col className="d-flex justify-content-end">
                  <Button href={objetoContenido.url} target="_blank" rel="noopener noreferrer" variant="primary" style={{ marginRight: '10px' }}>
                    Ver archivo
                  </Button>
                  <Button
                    variant="warning"
                    style={{ marginRight: '10px' }}
                    onClick={() => handleShow(objetoContenido)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    style={{ marginRight: '10px' }}
                    onClick={() => eliminarContenido(objetoContenido.id)}
                  >
                    Eliminar contenido
                  </Button>
                  <CopyToClipboard
                    text={objetoContenido.url}
                    onCopy={() => setCopied(true)}
                  >
                    <Button variant="info" style={{ marginRight: '10px' }}>
                      Copiar URL
                    </Button>
                  </CopyToClipboard>
                  <CopyToClipboard
                    text={generateEmbedCode(objetoContenido.url)}
                    onCopy={() => setCopied(true)}
                  >
                    <Button variant="info">
                      Copiar Código de Inserción
                    </Button>
                  </CopyToClipboard>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <AssetGallery
          arrayContenido={filteredContent}
          eliminarContenido={eliminarContenido}
          correoUsuario={correoUsuario}
          setArrayContenido={setArrayContenido}
        />
      )}
      {selectedAsset && (
        <AssetDetails
          show={show}
          handleClose={handleClose}
          selectedAsset={selectedAsset}
          correoUsuario={correoUsuario}
          setArrayContenido={setArrayContenido}
          arrayContenido={arrayContenido}
        />
      )}
    </Container>
  );
};

export default ListadoContenido;
