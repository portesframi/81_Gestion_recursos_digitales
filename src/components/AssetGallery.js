import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AssetDetails from "./AssetDetails";

const AssetGallery = ({ arrayContenido, eliminarContenido, correoUsuario, setArrayContenido }) => {
  const [show, setShow] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShow = (asset) => {
    setSelectedAsset(asset);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const generateEmbedCode = (url) => {
    return `<iframe src="${url}" width="600" height="400" frameborder="0" allowfullscreen></iframe>`;
  };

  return (
    <Container>
      <Row>
        {arrayContenido.map((objetoContenido) => (
          <Col key={objetoContenido.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img variant="top" src={objetoContenido.url} />
              <Card.Body>
                <Card.Text>{objetoContenido.descripcion}</Card.Text>
                <div className="d-flex flex-column">
                  <Button href={objetoContenido.url} target="_blank" rel="noopener noreferrer" variant="primary" className="mb-2">
                    Ver archivo
                  </Button>
                  <Button
                    variant="warning"
                    className="mb-2"
                    onClick={() => handleShow(objetoContenido)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="mb-2"
                    onClick={() => eliminarContenido(objetoContenido.id)}
                  >
                    Eliminar contenido
                  </Button>
                  <CopyToClipboard
                    text={objetoContenido.url}
                    onCopy={() => setCopied(true)}
                  >
                    <Button variant="info" className="mb-2">
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
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
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

export default AssetGallery;
