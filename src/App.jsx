import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Inicio from "./views/Inicio";
import Encabezado from "./components/emcabezado/Encabezado";
import RutaProtegida from "./components/rutas/RutasProtegida";

import Productos from "./views/Productos";
import Categorias from "./views/Categorias";
import Clientes from "./views/Clientes";
import Ventas from "./views/Ventas";
import Compras from "./views/Compras";
import Usuarios from "./views/Usuarios";
import Empleados from "./views/Empleados";
import Estadisticas from "./views/Estadisticas";
import Dashboard from "./views/Dashboar";
import './App.css';



const App = () => {
  return (
    <Router>
      <Encabezado/>
      <main className="margen-superior-main">
          <Routes>
 
            <Route path="/" element={<Login />} />
            <Route path="/inicio" element={<Inicio />} />
            
            <Route path="/productos" element={<RutaProtegida vista = {<Productos />} />} />
            <Route path="/categorias" element={<RutaProtegida vista = {<Categorias />} />} />
            <Route path="/clientes" element={<RutaProtegida vista = {<Clientes />} />} />
            <Route path="/ventas" element={<RutaProtegida vista = {<Ventas />} />} />
            <Route path="/compras" element={<RutaProtegida vista = {<Compras />} />} />
            <Route path="/usuarios" element={<RutaProtegida vista = {<Usuarios/>} />} />
            <Route path="/empleados" element={<RutaProtegida vista = {<Empleados/>} />} />
            <Route path="/estadisticas" element={<RutaProtegida vista = {<Estadisticas/>} />} />
            <Route path="/dashboard" element={<Dashboard/>} />


          </Routes>
      </main>
    </Router>
  );
};

export default App;