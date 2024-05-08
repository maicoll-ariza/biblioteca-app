import axios from "axios";

import Crud from "../components/Crud";
import "../styles/Libros.css";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import Swal from "sweetalert2";
const Libros = () => {
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

  const obtenerLibros = async () => {
    try {
      const uid = localStorage.getItem("uid");
      const email = localStorage.getItem("email");
      setUsuario({ uid, email });
      const { data } = await axios.post(
        `http://localhost:3050/api/general/libros`,
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
  }, []);

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
        `http://localhost:3050/api/reserva/modificar`,
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
        `http://localhost:3050/api/favorito/modificar`,
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

  return (
    <div className="container-libro">
      <input type="checkbox" id="toggle" className="toggle" />
      <label htmlFor="toggle" className="labelToggle">
        Gestionar libro
      </label>
      <div className="content">
        <Crud libro={libroSeleccionado} getLibros={actualizarListadoLibros} />
      </div>

      <div className="container-listado-libro">
        {libros.map((libro) => (
          <Card
            key={libro._id}
            libro={libro}
            seleccionarLibro={seleccionarLibro}
            modificarReserva={modificarReserva}
            agregarFavorito={agregarFavorito}
          />
        ))}
      </div>
    </div>
  );
};

export default Libros;
