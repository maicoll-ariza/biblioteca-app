import React, { useState } from "react";
import { auth } from "../database/firebase.config";
import { useNavigate } from "react-router-dom";

// #region Estilos
import "./Login.css";
// #endregion

const Login = () => {
  const [passwordVisble, setPasswordVisble] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [modoRegistro, setModoRegistro] = useState(true);

  // #region Validaciones
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPass(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
    } else if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError(
        "La contraseña debe contener al menos una letra minúscula"
      );
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError(
        "La contraseña debe contener al menos una letra mayúscula"
      );
    } else if (!/(?=.*\d)/.test(password)) {
      setPasswordError("La contraseña debe contener al menos un número");
    } else if (!/(?=.*[@$!%*?&])/.test(password)) {
      setPasswordError(
        "La contraseña debe contener al menos un carácter especial"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleChangeEmail = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const validateEmail = (email) => {
    // Expresión regular para validar el formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Por favor, introduce un correo electrónico válido");
    } else {
      setEmailError("");
    }
  };

  // #endregion

  const navigate = useNavigate();
  const guardarDatos = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    validateEmail(email);
    validatePassword(pass);
    if (emailError || passwordError) return;
    setError(null);
    modoRegistro ? registrar() : Login();
  };
  //registrar
  const registrar = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, pass);
      setIsLoading(false);
      setItemsOnLocalStorage(user);
      navigate("/libros");
      setEmail("");
      setPass("");
      setError("");
      location.reload();

    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/email-already-in-use")
        setError("Email ya registrado");
    }
  }, [email, pass]);
  //login
  const Login = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, pass);
      setIsLoading(false);
      setItemsOnLocalStorage(user);

      //limpiar estados
      setEmail("");
      setPass("");
      setError(null);
      navigate("/libros");
      location.reload();
    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/internal-error")
        setError("Credenciales incorrectas");
    }
  }, [email, pass]);

  const cambiarModo = () => {
    setModoRegistro(!modoRegistro);
    setFormSubmitted(false);
  };

  const setItemsOnLocalStorage = (user) => {
    localStorage.setItem("email", user.email);
    localStorage.setItem("uid", user.uid);
  };
  return (
    // <div>
    //   <div className="row justify-content-center mt-5">
    //     <div className="col-12 col-md-6 col-xl-4">
    //       <form onSubmit={guardarDatos}>
    //         {error && (
    //
    //         )}
    //         <input
    //           type="email"
    //           className="form-control mb-3"
    //           placeholder="Ingrese su email"
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //         <input
    //           type="password"
    //           className="form-control mb-3"
    //           placeholder="Ingrese su contraseña"
    //           onChange={ handleChangePassword }
    //         />
    //         <div className="d-grid gap-2">
    //           <button className="btn btn-dark">
    //             {modoRegistro ? "Registrarse" : "Acceder"}
    //           </button>

    //           <button
    //             className="btn btn-primary"
    //             onClick={() => setModoRegistro(!modoRegistro)}
    //             type="button"
    //           >
    //             { modoRegistro ? "Iniciar sesión" : "¿No tienes cuenta? Regístrese"}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    // </div>
    <div className="container-page">
      <section className="detail backgorund-info">
        <div className="header-detail">
          <i className="fa-solid fa-book-open-reader"></i>{" "}
          <h2 className="title-detail">Library</h2>
        </div>
        <div className="body-detail">
          <p className="paragraph-detail">
            ¡Descubre, presta y disfruta de una experiencia de lectura sin
            complicaciones con Library!
          </p>
        </div>
      </section>

      <form onSubmit={guardarDatos} className="form">
        <div className="alert-error-message" role="alert">
          {error}
        </div>
        <div className="input-container">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            className="input input-email"
            autoComplete="off"
            placeholder=" "
            onChange={handleChangeEmail}
          />
          <label htmlFor="email" className="label">
            Email*
          </label>
          {formSubmitted && <span className="error-message">{emailError}</span>}
          {/* <span className="error-message">{ formSubmitted ? emailError : ''}</span> */}
        </div>

        <div className="input-container">
          <input
            type={passwordVisble ? "text" : "password"}
            id="password"
            name="password"
            value={pass}
            className="input input-password"
            placeholder=" "
            onChange={handleChangePassword}
          />
          <label htmlFor="password" className="label">
            Contraseña*
          </label>
          <i
            onClick={() => setPasswordVisble(!passwordVisble)}
            className={` password-icon fa-regular ${
              passwordVisble ? "fa-eye-slash" : " fa-eye"
            }`}
          ></i>
          {formSubmitted && (
            <span className="error-message">{passwordError}</span>
          )}
        </div>

        <button disabled={isLoading} type="submit" className="btn-primary">
          {modoRegistro ? "Registrarse" : "Acceder"}{" "}
          {isLoading && <span className="loader"></span>}
        </button>
        <button
          className="btn-secondary"
          onClick={cambiarModo}
          disabled={isLoading}
          type="button"
        >
          {modoRegistro ? "Iniciar sesión" : "¿No tienes cuenta? Regístrese"}
        </button>
      </form>
    </div>
  );
};

export default Login;
