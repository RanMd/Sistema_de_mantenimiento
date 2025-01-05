import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Ubicacion {
    id: number;
    name: string;
}

interface Activo {
    id_act: number;
    name_act: string;
    code_act: string;
}

interface Componente {
    id_comp: number;
    name_comp: string;
}

interface Mantenimiento {
    num_mant: number;
    cod_mant: string;
    description: string;
    start_mant: string;
    state_mant: string;
    end_mant: string | null;
}

const CrearMantenimiento: React.FC = () => {
    const [codigoMantenimiento, setCodigoMantenimiento] = useState<string>('');
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>('');
    const [activos, setActivos] = useState<Activo[]>([]);
    const [activoSeleccionado, setActivoSeleccionado] = useState<string>('');
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [componenteSeleccionado, setComponenteSeleccionado] = useState<string>('');
    const [tipoMantenimiento, setTipoMantenimiento] = useState<string>('preventivo');
    const [estadoActivo, setEstadoActivo] = useState<string>('activo');
    const [comentario, setComentario] = useState<string>('');
    const [descripcion, setDescripcion] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState<Mantenimiento | null>(null);

    useEffect(() => {
        const generarCodigo = () => {
            const timestamp = new Date().getTime();
            setCodigoMantenimiento(`MTTO-${timestamp}`);
        };
        generarCodigo();
    }, []);

    useEffect(() => {
        const obtenerUbicaciones = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/ubicaciones');
                const ubicaciones = response.data.data.map((ubicacion: any) => ({
                    id: ubicacion.id_ubi,
                    name: ubicacion.name_ubi,
                }));
                setUbicaciones(ubicaciones);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener las ubicaciones');
                setLoading(false);
            }
        };
        obtenerUbicaciones();
    }, []);

    const obtenerMantenimientos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/mantenimiento/allMant');
            setMantenimientos(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Error al obtener los mantenimientos');
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerMantenimientos();
    }, []);

    const manejarCambioUbicacion = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idUbicacion = event.target.value;
        setUbicacionSeleccionada(idUbicacion);
        if (idUbicacion) {
            obtenerActivosPorUbicacion(idUbicacion);
        } else {
            setActivos([]);
            setActivoSeleccionado('');
            setComponentes([]);
        }
    };

    const manejarCambioActivo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const idActivo = event.target.value;
        setActivoSeleccionado(idActivo);
        if (idActivo) {
            obtenerComponentesPorActivo(idActivo);
        } else {
            setComponentes([]);
            setComponenteSeleccionado('');
        }
    };

    const manejarCambioComponente = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setComponenteSeleccionado(event.target.value);
    };

    const obtenerActivosPorUbicacion = async (idUbicacion: string) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/activos/getActivesPerUbication', {
                id_ubication: idUbicacion,
            });
            setActivos(Array.isArray(response.data.data) ? response.data.data : []);
            setLoading(false);
        } catch (err) {
            setError('Error al obtener los activos');
            setLoading(false);
        }
    };

    const obtenerComponentesPorActivo = async (idActivo: string) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/api/componente/componentes', {
                id_act: idActivo,
            });
            setComponentes(Array.isArray(response.data.data) ? response.data.data : []);
            setLoading(false);
        } catch (err) {
            setError('Error al obtener los componentes');
            setLoading(false);
        }
    };

    const enviarMantenimiento = async () => {
        if (!activoSeleccionado || !ubicacionSeleccionada || !componenteSeleccionado) {
            alert('Seleccione ubicación, activo y componente antes de continuar.');
            return;
        }

        try {
            setLoading(true);

            const mantenimientoResponse = await axios.post('http://localhost:3000/api/mantenimiento/createMant', {
                cod_mant: codigoMantenimiento,
                user_mant: '1',
                start_mant: new Date().toISOString(),
                state_mant: 'Iniciado',
                description: descripcion,
            });

            const num_mant = mantenimientoResponse.data.data.num_mant;

            await axios.post('http://localhost:3000/api/detalle/createDet', {
                num_mant,
                id_act: activoSeleccionado,
                state_act: estadoActivo,
                type_mant: tipoMantenimiento,
                comentario,
            });

            await axios.post('http://localhost:3000/api/componenteMantenimiento/compActMant', {
                id_com_per: componenteSeleccionado,
                activo_per: activoSeleccionado,
                num_mant_per: num_mant,
            });

            alert('Mantenimiento creado con éxito.');
            setCodigoMantenimiento(`MTTO-${new Date().getTime()}`);
            setActivoSeleccionado('');
            setUbicacionSeleccionada('');
            setComponentes([]);
            setComponenteSeleccionado('');
            setComentario('');
            setDescripcion('');
            obtenerMantenimientos();
        } catch (err) {
            setError('Error al guardar el mantenimiento');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const manejarSeleccionMantenimiento = (mantenimiento: Mantenimiento) => {
        setMantenimientoSeleccionado(mantenimiento);
        setActivoSeleccionado('');
        setComponenteSeleccionado('');
        setUbicacionSeleccionada('');
        setActivos([]);
        setComponentes([]);
    };

    const agregarActivoComponente = async () => {
        if (!activoSeleccionado || !componenteSeleccionado) {
            alert('Debe seleccionar un activo y un componente.');
            return;
        }

        try {
            setLoading(true);
            const mantenimiento = mantenimientoSeleccionado!;
            const num_mant = mantenimiento.num_mant;

            await axios.post('http://localhost:3000/api/detalle/createDet', {
                num_mant,
                id_act: activoSeleccionado,
                state_act: estadoActivo,
                type_mant: tipoMantenimiento,
                comentario,
            });

            await axios.post('http://localhost:3000/api/componenteMantenimiento/compActMant', {
                id_com_per: componenteSeleccionado,
                activo_per: activoSeleccionado,
                num_mant_per: num_mant,
            });

            alert('Activo y componente agregados con éxito.');
            setActivoSeleccionado('');
            setComponenteSeleccionado('');
            setComentario('');
            setDescripcion('');
        } catch (err) {
            setError('Error al agregar el activo y componente');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Crear Mantenimiento</h1>
            <div>
                <label>Código de Mantenimiento:</label>
                <input type="text" value={codigoMantenimiento} readOnly />
            </div>
            <div>
                <label>Seleccionar Ubicación:</label>
                <select value={ubicacionSeleccionada} onChange={manejarCambioUbicacion}>
                    <option value="">Seleccione una ubicación</option>
                    {ubicaciones.map((ubicacion) => (
                        <option key={ubicacion.id} value={ubicacion.id}>
                            {ubicacion.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Seleccionar Activo:</label>
                <select value={activoSeleccionado} onChange={manejarCambioActivo}>
                    <option value="">Seleccione un activo</option>
                    {activos.map((activo) => (
                        <option key={activo.id_act} value={activo.id_act}>
                            {activo.name_act} - {activo.code_act}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Seleccionar Componente:</label>
                <select value={componenteSeleccionado} onChange={manejarCambioComponente}>
                    <option value="">Seleccione un componente</option>
                    {componentes.map((componente) => (
                        <option key={componente.id_comp} value={componente.id_comp}>
                            {componente.name_comp}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Tipo de Mantenimiento:</label>
                <select value={tipoMantenimiento} onChange={(e) => setTipoMantenimiento(e.target.value)}>
                    <option value="preventivo">Preventivo</option>
                    <option value="correctivo">Correctivo</option>
                    <option value="emergencia">Emergencia</option>
                </select>
            </div>
            <div>
                <label>Estado del Activo:</label>
                <select value={estadoActivo} onChange={(e) => setEstadoActivo(e.target.value)}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="en_reparacion">En Reparación</option>
                </select>
            </div>
            <div>
                <label>Comentario:</label>
                <input type="text" value={comentario} onChange={(e) => setComentario(e.target.value)} />
            </div>
            <div>
                <label>Descripción:</label>
                <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={enviarMantenimiento} disabled={loading}>
                {loading ? 'Guardando...' : 'Iniciar Mantenimiento'}
            </button>

            <hr />
            {/* Mostrar Mantenimientos */}
            <h2>Lista de Mantenimientos</h2>
            {loading ? (
                <p>Cargando mantenimientos...</p>
            ) : (
                <ul>
                    {mantenimientos.map((mantenimiento) => (
                        <li key={mantenimiento.num_mant} onClick={() => manejarSeleccionMantenimiento(mantenimiento)}>
                            <strong>{mantenimiento.cod_mant}</strong> - {mantenimiento.description} - {mantenimiento.state_mant}
                        </li>
                    ))}
                </ul>
            )}

            {/* Si hay un mantenimiento seleccionado, mostrar el formulario para añadir activos y componentes */}
            {mantenimientoSeleccionado && (
                <div>
                    <h3>Añadir Activo y Componente al Mantenimiento {mantenimientoSeleccionado.cod_mant}</h3>
                    <div>
                        <label>Activo:</label>
                        <select value={activoSeleccionado} onChange={manejarCambioActivo}>
                            <option value="">Seleccione un activo</option>
                            {activos.map((activo) => (
                                <option key={activo.id_act} value={activo.id_act}>
                                    {activo.name_act} - {activo.code_act}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Componente:</label>
                        <select value={componenteSeleccionado} onChange={manejarCambioComponente}>
                            <option value="">Seleccione un componente</option>
                            {componentes.map((componente) => (
                                <option key={componente.id_comp} value={componente.id_comp}>
                                    {componente.name_comp}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={agregarActivoComponente} disabled={loading}>
                        {loading ? 'Agregando...' : 'Agregar Activo y Componente'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CrearMantenimiento;
