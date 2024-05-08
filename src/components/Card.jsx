import PropTypes from "prop-types";
import "../styles/Card.css";
const Card = ({ libro, seleccionarLibro, modificarReserva, agregarFavorito }) => {
  return (
    <div className="card" onClick={() => seleccionarLibro(libro)}>
      <div className="card-portada">
        <button onClick={() => agregarFavorito(libro)} className={ `btn-nobg ${libro.esFavorito &&  "active"}` }>
          <i className="fa-solid fa-star"></i>
        </button>
        <img src={libro.portada} alt={`Portada libro-${libro.titulo}`} />
      </div>
      <div className="info">
        <h3 className="libro-titulo">{libro.titulo}</h3>
        <span className="libro-autor">{libro.autor}</span>
        <p className="libro-detalle" title={libro.sipnosis}>
          {libro.sipnosis}
        </p>
      </div>
      <div className="actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!libro.disponible && !libro.reservadoPorUsuario) return;
            modificarReserva(libro);
          }}
          className={`${
            libro.disponible
              ? "btn-pri"
              : libro.reservadoPorUsuario
              ? "btn-ter"
              : "btn-quar"
          }`}
        >
          {`${
            libro.disponible
              ? "Reservar"
              : libro.reservadoPorUsuario
              ? "Devolver"
              : "No disponible"
          }`}
        </button>
      </div>
    </div>
  );
};
Card.propTypes = {
  libro: PropTypes.shape({
    portada: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    autor: PropTypes.string.isRequired,
    sipnosis: PropTypes.string.isRequired,
    disponible: PropTypes.bool.isRequired,
    reservadoPorUsuario: PropTypes.bool.isRequired,
    esFavorito: PropTypes.bool.isRequired,
  }).isRequired,
  seleccionarLibro: PropTypes.func.isRequired,
  modificarReserva: PropTypes.func.isRequired,
  agregarFavorito: PropTypes.func.isRequired,
};

export default Card;
