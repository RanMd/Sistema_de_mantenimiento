import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/useAuth';
import { ReactNode } from 'react';

import CrearActivo from '../administrador/CrearActivo';
import ActivesPage from './Actives';
import Navbar from '../administrador/Navbar';
import Login from './Login';

import '../styles/app.css'

const loginRoute: string = '/';

const App = () => {
    return (
        <AuthProvider>
            <AppLayout>
                <Routes>
                    <Route path={loginRoute} element={<Login />} />
                    <Route path="/activos" element={<ActivesPage />} />
                    <Route path="/crear-activo" element={<CrearActivo />} />
                    <Route path="/crear-activo/:tipo" element={<CrearActivo />} />
                    <Route path="/eliminar-activo" element={<h2>Eliminar Activo</h2>} />
                    <Route path="/reportes" element={<h2>Reportes</h2>} />
                    <Route path="/fichas" element={<h2>Fichas</h2>} />
                    <Route path="/cerrar-sesion" element={<h2>Cerrar Sesión</h2>} />
                </Routes>
            </AppLayout>
        </AuthProvider>
    );
};

const AppLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation()

    const hideNavbar = location.pathname === loginRoute;

    if (hideNavbar) return children

    return (
        <>
            <Navbar />
            <main>
                {children}
            </main>
        </>
    )
}

export default App;