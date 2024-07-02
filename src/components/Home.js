import React, { useState, useEffect } from "react";
import firebaseApp from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Container, Button } from "react-bootstrap";
import AgregarContenido from "./AgregarContenido";
import ListadoContenido from "./ListadoContenido";
import AssetDetails from "./AssetDetails";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Home = ({ correoUsuario }) => {
  const [arrayContenido, setArrayContenido] = useState(null);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const fakeData = [
    { id: 1, descripcion: "Contenido 1", url: "https://picsum.photos/420" },
    { id: 2, descripcion: "Contenido 2", url: "https://picsum.photos/420" },
    { id: 3, descripcion: "Contenido 3", url: "https://picsum.photos/420" },
  ];

  async function buscarDocumentOrCrearDocumento(idDocumento) {
    const docuRef = doc(firestore, `usuarios/${idDocumento}`);
    const consulta = await getDoc(docuRef);
    if (consulta.exists()) {
      const infoDocu = consulta.data();
      return infoDocu.contenido;
    } else {
      await setDoc(docuRef, { contenido: [...fakeData] });
      const consulta = await getDoc(docuRef);
      const infoDocu = consulta.data();
      return infoDocu.contenido;
    }
  }

  useEffect(() => {
    async function fetchContenido() {
      const contenidoFetchado = await buscarDocumentOrCrearDocumento(correoUsuario);
      setArrayContenido(contenidoFetchado);
    }
    fetchContenido();
  }, [correoUsuario]);

  return (
    <Container>
      <h4>Buenos días, su sesión está iniciada</h4>
      <Button onClick={() => signOut(auth)}>Cerrar sesión</Button>
      <hr />
      {activoSeleccionado ? (
        <AssetDetails
          activo={activoSeleccionado}
          setActivoSeleccionado={setActivoSeleccionado}
          correoUsuario={correoUsuario}
          setArrayContenido={setArrayContenido}
          arrayContenido={arrayContenido}
        />
      ) : (
        <>
          <AgregarContenido
            arrayContenido={arrayContenido}
            setArrayContenido={setArrayContenido}
            correoUsuario={correoUsuario}
          />
          {arrayContenido && (
            <ListadoContenido
              arrayContenido={arrayContenido}
              setArrayContenido={setArrayContenido}
              correoUsuario={correoUsuario}
              setActivoSeleccionado={setActivoSeleccionado}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
