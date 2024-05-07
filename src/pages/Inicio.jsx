import { Link } from "react-router-dom";

import "./Inicio.css";
import imageInicio from "../assets/icons/inicio.svg";

const Inicio = () => {
  return (
    <div className="inicio-container-page">
      <div className="backgorund-info">
        <div className="container-header">
          <h1 className="title-header">
            Tu plataforma en línea para gestionar fácilmente tus préstamos de
            libros y descubrir nuevas lecturas favoritas
          </h1>
          <Link to={"/login"}>
            <button className="btn-register">¡Quiero registrarme ahora!</button>
          </Link>
        </div>
      </div>

      <section className="body-page">
        <div className="container-info">
          <h2 className="title-body">¿Qué es Biblioteca?</h2>
          <p>
            Biblioteca es una plataforma en línea que te permite gestionar
            fácilmente tus préstamos de libros. Con Biblioteca, podrás llevar un
            registro de los libros que tienes prestados, los libros que has
            prestado a tus amigos y las fechas de devolución. Además, podrás
            descubrir nuevas lecturas favoritas a través de nuestra amplia
            selección de libros recomendados.
          </p>
        </div>
        <img
          className="ilustration"
          src={imageInicio}
          alt="Imagen de referencia"
        />
      </section>
    </div>
  );
};

export default Inicio;
