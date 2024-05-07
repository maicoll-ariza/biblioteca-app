import "./App.css";

import { BrowserRouter as Router,
  Routes,
  Route
  } from 'react-router-dom'

import Navbar from "./components/Navbar";
import Login from "./auth/Login";
import Inicio from "./pages/Inicio";
import Libros from "./pages/Libros";

function App() {
  return (
      <Router>
      <div className="container">

        <Navbar />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="login" element={<Login />} />
          <Route path="libros" element={<Libros />} />
          {/* <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
      </Router>
  );
}

export default App;
