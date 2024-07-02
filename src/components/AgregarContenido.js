import React, { useState } from "react";
import { Container, Form, Col, Row, Button, ProgressBar } from "react-bootstrap";
import firebaseApp from "../credenciales";
import { getFirestore, updateDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const AgregarContenido = ({ correoUsuario, setArrayContenido, arrayContenido }) => {
  const [descripcion, setDescripcion] = useState("");
  const [archivoLocal, setArchivoLocal] = useState(null);
  const [urlDescarga, setUrlDescarga] = useState("");
  const [progresoCarga, setProgresoCarga] = useState(0);
  const [tipoArchivo, setTipoArchivo] = useState(""); // Estado para el tipo de archivo

  const añadirContenido = async (e) => {
    e.preventDefault();

    if (!archivoLocal) {
      alert("Por favor, carga un archivo primero.");
      return;
    }

    if (!urlDescarga) {
      alert("Espera mientras se carga el archivo.");
      return;
    }

    try {
      const nvoArrayContenido = [
        ...arrayContenido,
        {
          id: +new Date(),
          descripcion: descripcion,
          url: urlDescarga,
          tipo: tipoArchivo, // Añadir el tipo de archivo
        },
      ];

      const docuRef = doc(firestore, `usuarios/${correoUsuario}`);
      await updateDoc(docuRef, { contenido: nvoArrayContenido });

      setArrayContenido(nvoArrayContenido);
      setDescripcion("");
      setArchivoLocal(null);
      setUrlDescarga("");
      setProgresoCarga(0);
      setTipoArchivo("");
    } catch (error) {
      console.error("Error al actualizar Firestore:", error);
    }
  };

  const fileHandler = async (e) => {
    try {
      const archivoSeleccionado = e.target.files[0];
      setArchivoLocal(archivoSeleccionado);

      const archivoRef = ref(storage, `documentos/${archivoSeleccionado.name}`);
      const tareaCarga = uploadBytesResumable(archivoRef, archivoSeleccionado);

      tareaCarga.on("state_changed", 
        (snapshot) => {
          const progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgresoCarga(progreso);
        },
        (error) => {
          console.error("Error al cargar el archivo:", error);
        },
        async () => {
          const url = await getDownloadURL(tareaCarga.snapshot.ref);
          setUrlDescarga(url);
        }
      );

    } catch (error) {
      console.error("Error al cargar el archivo a Firebase Storage:", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={añadirContenido}>
        <Row className="mb-3">
          <Col>
            <Form.Control
              type="text"
              placeholder="Describe tu contenido"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="file"
              placeholder="Añade archivo"
              onChange={fileHandler}
            />
          </Col>
          <Col>
            <Form.Control
              as="select"
              placeholder="Tipo de archivo"
              value={tipoArchivo}
              onChange={(e) => setTipoArchivo(e.target.value)}
            >
              <option value="">Selección formato</option>
              <option value="text">Texto</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="image">Imagen</option>
            </Form.Control>
          </Col>
          <Col>
            <Button type="submit">Agregar Contenido</Button>
          </Col>
        </Row>
        {archivoLocal && (
          <Row>
            <Col>
              <ProgressBar now={progresoCarga} label={`${progresoCarga.toFixed(2)}%`} />
            </Col>
          </Row>
        )}
      </Form>
      <hr />
    </Container>
  );
};

export default AgregarContenido;
