import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';

const Navbar: React.FC = () => {
    const nav = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        nav('/login');
    }

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item dropdown">
                    <span className="dropdown-toggle">Crear Activo</span>
                    <ul className="dropdown-menu">
                        <li className="dropdown-item">
                            <Link to="/crear-activo/individual">Activo Individual</Link>
                        </li>
                        <li className="dropdown-item">
                            <Link to="/crear-activo/lote">Activos por Lote</Link>
                        </li>
                    </ul>
                </li>
                <li className="navbar-item">
                    <Link to="/eliminar-activo">Eliminar Activo</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/activos">Activos</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/reportes">Reportes</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/fichas">Fichas</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/" onClick={logout}>Cerrar Sesión</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
