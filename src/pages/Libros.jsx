import axios from "axios";

import Crud from "../components/Crud";
import "../styles/Libros.css";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Swal from "sweetalert2";

import ImageNoData from "../assets/icons/no-data.svg";

const Libros = () => {
  // #region Buscador
  const [texto, setTexto] = useState("");
  const [textoDebounce, setTextoDebounce] = useState("");
  // #endregion
  const [usuario, setUsuario] = useState({ uid: "", email: "" });
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState({
    _id: "",
    titulo: "",
    autor: "",
    sipnosis: "",
    portada: "",
    disponible: false,
    reservadoPorUsuario: false,
  });

  // #region validaciones
  const [isAdmin, setIsAdmin] = useState(false);
  // #endregion

  const obtenerLibros = async () => {
    try {
      const uid = localStorage.getItem("uid");
      const email = localStorage.getItem("email");
      setUsuario({ uid, email });
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/general/libros`,
        { usuario: uid }
      );
      if (data.ok) {
        setLibros(data.listadoLibrosInfo);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    obtenerLibros();
    validarAdmin();
  }, []);

  const validarAdmin = () => {
    const email = localStorage.getItem("email");
    if (email === "maicoll.ariza.c@gmail.com") {
      setIsAdmin(true);
    }
  };

  const actualizarListadoLibros = async () => {
    obtenerLibros();
  };

  const seleccionarLibro = (libro) => {
    setLibroSeleccionado(libro);
  };

  const modificarReserva = async (libro) => {
    try {
      const request = {
        idLibro: libro._id,
        idUsuario: usuario.uid,
        correoUsuario: usuario.email,
      };
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/reserva/modificar`,
        request
      );
      if (data.ok) {
        obtenerLibros();
        Swal.fire({
          icon: "success",
          title: data.message,
          text: "La reserva ha sido modificada con éxito",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al modificar la reserva",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    }
  };

  const agregarFavorito = async (libro) => {
    try {
      const request = {
        libro: libro._id,
        usuario: usuario.uid,
      };
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/favorito/modificar`,
        request
      );
      if (data.ok) {
        obtenerLibros();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        showConfirmButton: true,
      });
    }
  };

  // #region Buscador
  useEffect(() => {
    const manejador = setTimeout(() => {
      setTextoDebounce(texto);
    }, 1000);

    return () => {
      clearTimeout(manejador);
    };
  }, [texto]);

  useEffect(() => {
    buscarLibros();
  }, [textoDebounce]);

  const buscarLibros = async () => {
    try {
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/general/libros`,
        { usuario: usuario.uid, autor: textoDebounce, titulo: textoDebounce }
      );
      if (data.ok) {
        setLibros(data.listadoLibrosInfo);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // #endregion

  return (
    <div className="container-libro">
      {isAdmin && (
        <>
          <input type="checkbox" id="toggle" className="toggle" />
          <label htmlFor="toggle" className="labelToggle">
            Gestionar libro
          </label>
          <div className="content">
            <Crud
              libro={libroSeleccionado}
              getLibros={actualizarListadoLibros}
            />
          </div>
        </>
      )}
      <div className="container-buscador">
        <input
          type="text"
          className="input-buscador input"
          placeholder="Buscar libro por autor o título"
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>
      <div className="container-listado-libro">
        {libros.length > 0 ? (
          libros.map((libro) => (
            <Card
              key={libro._id}
              libro={libro}
              seleccionarLibro={seleccionarLibro}
              modificarReserva={modificarReserva}
              agregarFavorito={agregarFavorito}
            />
          ))
        ) : (
          <div className="container-nodata">
            <img src={ImageNoData} alt="Ilustracion" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Libros;
