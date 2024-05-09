import "./App.css";

import { BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  } from 'react-router-dom'

import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Inicio from "./pages/Inicio";
import Libros from "./pages/Libros";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    const uid = localStorage.getItem('uid');
    setIsAuthenticated(!!uid);
  }, []);

  return (
      <Router>
      <div className="container">

        <Navbar 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin} />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="login" element={ !isAuthenticated ? <Login /> :  (<Navigate to="/"/>)} />
          <Route path="libros" element={ isAuthenticated ? <Libros /> : (<Navigate to="/login"/>) } />
          <Route path="admin" element={ isAdmin ? <Admin /> : (<Navigate to="/login"/>) } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      </Router>
  );
}

export default App;
