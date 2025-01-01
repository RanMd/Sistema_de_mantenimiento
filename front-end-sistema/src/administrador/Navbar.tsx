import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import React from 'react';

const Navbar: React.FC = () => {
    const { logout } = useAuth();

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Sistema de Gestión</h1>
            <ul className="navbar-list">
                <li className="navbar-item">
                    <NavLink to="/activos" className={({ isActive }) => isActive ? 'item-active' : ''}>Activos</NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/procesos" className={({ isActive }) => isActive ? 'item-active' : ''}>Procesos de compra</NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/reportes" className={({ isActive }) => isActive ? 'item-active' : ''}>Reportes</NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/fichas" className={({ isActive }) => isActive ? 'item-active' : ''}>Fichas</NavLink>
                </li>
                <li className="navbar-item">
                    <NavLink to="/" onClick={logout}>Cerrar Sesión</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
