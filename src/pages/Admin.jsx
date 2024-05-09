import axios from "axios";
import Ilustration from "../assets/icons/admin.svg";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const Admin = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    obtenerReservas();
  }, []);

  const obtenerReservas = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3050/api/reserva`);
      if (data.ok) {
        setReservas(data.reservas);
        data.reservas.map((reserva) => {
          reserva.fechaReserva = formatearFecha(reserva.fechaReserva);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error al obtener las reservas",
      });
    }
  };

  const forzarEntrega = async (reserva) => {
    try {
      const request = {
        idLibro: reserva.idLibro._id,
        idUsuario: reserva.idUsuario,
        correoUsuario: reserva.correoUsuario,
      };
      const { data } = await axios.post(
        `http://localhost:3050/api/reserva/modificar`,
        request
      );
      if (data.ok) {
        obtenerReservas();
        Swal.fire({
          icon: "success",
          title: "Operación exitosa",
          text: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.log('error:', error)
      Swal.fire({
        icon: "error",
        title: "Error al modificar la reserva",
        text: error.response.data.message,
        showConfirmButton: true,
      });
    }
  };

  const confirmarForzarEntrega = (reserva) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez forzada la entrega, el usuario no podrá seguir disfrutando del libro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, forzar entrega",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        forzarEntrega(reserva);
      }
    });
  }

  const formatearFecha = (fecha) => {
    const fechaFormateada = new Date(fecha);
    return fechaFormateada.toLocaleString();
  };

  return (
    <div>
      <div className="container-page-admin">
        <div className="header-admin">
          <div className="col-1">
            <h3>¡Bienvenido, administrador!</h3>
            <p>
              En esta sección podrás visualizar los usuarios que tienen libros
              prestados. También podras forzar la entrega de los libros por
              parte de los usuarios
            </p>
          </div>
          <img src={Ilustration} alt="Imagen de para ver " />
        </div>

        <div className="body-admin">
          <table>
            <thead>
              <tr>
                <th>Correo usuario</th>
                <th>Título libro</th>
                <th>Fecha reserva</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva._id}>
                  <td>{reserva.correoUsuario}</td>
                  <td>{reserva.idLibro?.titulo}</td>
                  <td>{reserva.fechaReserva}</td>
                  <td>
                    <button className="btn-ter" onClick={ ()=> confirmarForzarEntrega(reserva) }>Forzar entrega</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
