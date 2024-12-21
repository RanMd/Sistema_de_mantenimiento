import { Route, Routes } from 'react-router-dom';
import React from 'react';
import CrearActivo from '../administrador/CrearActivo';
import Login from './Login';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/crear-activo" element={<CrearActivo />} />
            <Route path="/crear-activo/:tipo" element={<CrearActivo />} />
            <Route path="/eliminar-activo" element={<h2>Eliminar Activo</h2>} />
            <Route path="/activos" element={<h2>Activos</h2>} />
            <Route path="/reportes" element={<h2>Reportes</h2>} />
            <Route path="/fichas" element={<h2>Fichas</h2>} />
            <Route path="/cerrar-sesion" element={<h2>Cerrar Sesión</h2>} />
            <Route path="/" element={<Login />} />
        </Routes>
    );
};

export default App;