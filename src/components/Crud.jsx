import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { storage } from "../database/firebase.config";
import uploadImage from "../assets/icons/upload-image.svg";

import "../styles/Crud.css";
import axios from "axios";

const Crud = ({ libro, getLibros }) => {
  const [tituloError, setTituloError] = useState("");
  const [autorError, setAutorError] = useState("");
  const [sipnosisError, setSipnosisError] = useState("");
  const [fileError, setFileError] = useState("");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [sipnosis, setSipnosis] = useState("");
  const [idLibro, setIdLibro] = useState("");
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (libro) {
      setTitulo(libro.titulo);
      setAutor(libro.autor);
      setSipnosis(libro.sipnosis);
      setUrl(libro.portada);
      setIdLibro(libro._id);
      if (libro._id) {
        setIsEditing(true);
      }
    }
  }, [libro]);

  const guardarDatos = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    validateTitulo(titulo);
    validateAutor(autor);
    validateSipnosis(sipnosis);
    validateFile(url);

    if (titulo && autor && sipnosis && url) {
      isEditing ? editarLibro() : crearLibro();
    }
  };

  const crearLibro = async () => {
    try {
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/general/libros/crear`,
        {
          titulo,
          autor,
          sipnosis,
          portada: url,
        }
      );
      if (data.ok) {
        limpiarFormulario();
        getLibros();
        Swal.fire({
          icon: "success",
          title: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar el libro",
        text: error.response.data.message,
        showConfirmButton: true,
      });
    }
  };

  const editarLibro = async () => {
    try {
      const { data } = await axios.put(
        `https://server-biblioteca.onrender.com/api/general/libros/actualizar`,
        {
          titulo,
          autor,
          sipnosis,
          portada: url,
          id: idLibro,
        }
      );
      if (data.ok) {
        limpiarFormulario();
        getLibros();
        Swal.fire({
          icon: "success",
          title: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al modificar el libro",
        text: error.response.data.message,
        showConfirmButton: true,
      });
    }
  };

  const eliminarLibro = async () => {
    try {
      const { data } = await axios.post(
        `https://server-biblioteca.onrender.com/api/general/libros/eliminar`,
        {
          id: idLibro,
        }
      );
      if (data.ok) {
        limpiarFormulario();
        getLibros();
        Swal.fire({
          icon: "success",
          title: data.message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar el libro",
        text: error.response.data.message,
        showConfirmButton: true,
      });
    }
  };

  const confirmarEliminar = () => {
    if (!idLibro) {
      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: "Selecciona un libro para eliminar",
        showConfirmButton: true,
      });
      return;
    }
    Swal.fire({
      title: "¿Estás seguro de eliminar este libro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarLibro();
      }
    });
  };

  const limpiarFormulario = () => {
    setTitulo("");
    setAutor("");
    setSipnosis("");
    setFile("");
    setUrl("");
    setFormSubmitted(false);
    setTituloError("");
    setAutorError("");
    setSipnosisError("");
    setFileError("");

    setIdLibro("");
  };

  const activarModoEdicion = () => {
    if (!libro._id) {
      Swal.fire({
        icon: "error",
        title: "No se puede editar",
        text: "Selecciona un libro para editar",
        showConfirmButton: true,
      });
      return;
    }
    setIsEditing(true);
  };

  const desactivarModoEdicion = () => {
    limpiarFormulario();
    setIsEditing(false);
  };

  // #region handlers
  const handleChangeTitulo = (e) => {
    setTitulo(e.target.value);
    if (formSubmitted) validateTitulo(e.target.value);
  };

  const handleChangeAutor = (e) => {
    setAutor(e.target.value);
    if (formSubmitted) validateAutor(e.target.value);
  };

  const handleChangeSipnosis = (e) => {
    setSipnosis(e.target.value);
    if (formSubmitted) validateSipnosis(e.target.value);
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (formSubmitted) validateFile(file);
    if (file) {
      subirArchivo(file);
    }
  };
  // #endregion

  // #region validaciones
  const validateTitulo = (value) => {
    if (!value) {
      setTituloError("El título es requerido");
    } else {
      setTituloError("");
    }
  };

  const validateAutor = (value) => {
    if (!value) {
      setAutorError("El autor es requerido");
    } else {
      setAutorError("");
    }
  };

  const validateSipnosis = (value) => {
    if (!value) {
      setSipnosisError("La sipnosis es requerida");
    } else {
      setSipnosisError("");
    }
  };

  const validateFile = (value) => {
    if (!value) {
      setFileError("La portada es requerida");
    } else {
      setFileError("");
    }
  };
  // #endregion

  // #region subir archivo
  const subirArchivo = async (file) => {
    const storageRef = storage.ref("portadas/" + file.name);
    const task = storageRef.put(file);
    setUrl("");
    task.on(
      "state_changed",
      () => {
        setIsLoading(true);
      },
      () => {
        setIsLoading(false);
        setUrl("");
        Swal.fire({
          icon: "error",
          title: "Error al subir la imagen",
        });
      },
      () => {
        task.snapshot.ref.getDownloadURL().then((url) => {
          setUrl(url);
          setIsLoading(false);
        });
      }
    );
  };
  // #endregion
  return (
    <div className="container-crud">
      <div className="toolbar">
        <button
          className="btn-pri"
          disabled={isLoading}
          onClick={desactivarModoEdicion}
        >
          <i className="fa-solid fa-plus"></i>Nuevo
        </button>
        <button
          className="btn-sec"
          disabled={isLoading}
          onClick={activarModoEdicion}
        >
          <i className="fa-solid fa-pencil"></i>Editar
        </button>
        <button
          className="btn-ter"
          disabled={isLoading}
          onClick={confirmarEliminar}
        >
          <i className="fa-regular fa-trash-can"></i>Eliminar
        </button>
        <button
          className="btn-quar"
          onClick={limpiarFormulario}
          disabled={isLoading}
        >
          <i className="fa-solid fa-eraser"></i>Limpiar
        </button>
      </div>
      <h2 className="titulo-form">{isEditing ? "Editar" : "Nuevo"} libro</h2>
      <form onSubmit={guardarDatos} className="form form-libro" autoComplete="off">
        <div className="input-container libro">
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={titulo}
            className="input"
            autoComplete="off"
            placeholder=" "
            onChange={handleChangeTitulo}
          />
          <label htmlFor="titulo" className="label">
            Título*
          </label>
          {formSubmitted && (
            <span className="error-message">{tituloError}</span>
          )}
        </div>

        <div className="input-container libro">
          <input
            type="text"
            id="autor"
            name="autor"
            value={autor}
            className="input"
            placeholder=" "
            onChange={handleChangeAutor}
          />
          <label htmlFor="autor" className="label">
            Autor*
          </label>
          {formSubmitted && <span className="error-message">{autorError}</span>}
        </div>

        <div className="input-container libro">
          <textarea
            name="sipnosis"
            id="sipnosis"
            value={sipnosis}
            placeholder=" "
            onChange={handleChangeSipnosis}
          ></textarea>
          <label htmlFor="sipnosis" className="label">
            Sipnosis*
          </label>
          {formSubmitted && (
            <span className="error-message">{sipnosisError}</span>
          )}
        </div>
        <div className="input-container libro">
          <input
            type="file"
            accept="image/*"
            name="file-3"
            id="file-3"
            onChange={handleChangeFile}
            className="inputfile inputfile-3"
          />
          <label htmlFor="file-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="iborrainputfile"
              width="20"
              height="17"
              viewBox="0 0 20 17"
            >
              <path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path>
            </svg>
            <span className="iborrainputfile">
              {file ? file.name : "Seleccionar portada"}
            </span>
          </label>
          {formSubmitted && <span className="error-message">{fileError}</span>}
        </div>

        <div className="input-container libro container-image">
          <img src={url ? url : uploadImage} alt="Portada" />
        </div>

        <div className="input-container libro">
          <button disabled={isLoading} type="submit" className="btn-pri">
            Guardar
            {isLoading && <span className="loader"></span>}
          </button>
        </div>
      </form>
    </div>
  );
};

Crud.propTypes = {
  libro: PropTypes.shape({
    portada: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    autor: PropTypes.string.isRequired,
    sipnosis: PropTypes.string.isRequired,
    disponible: PropTypes.bool.isRequired,
    reservadoPorUsuario: PropTypes.bool.isRequired,
    _id: PropTypes.string,
  }).isRequired,
  getLibros: PropTypes.func.isRequired,
};

export default Crud;
