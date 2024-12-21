import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Combobox from './Combobox';
// import './CrearActivo.css';
import Navbar from './nvar';

const CrearActivo: React.FC = () => {
    const { tipo } = useParams<{ tipo: string }>();
    const [formData, setFormData] = useState({
        id_act: '2',
        registrado_por: 1,
        nombre: '',
        marca: '',
        modelo: '',
        serie: '',
        ubicacion: '',
        estado: '',
        responsable: '',
        proveedor: '',
        tipo_activo: '',
        cantidad: 1,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'cantidad' ? parseInt(value) : value,
        });
    };

    const handleComboboxChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fechaCompra = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Función para generar un ID único con formato `ACT-XXXXX`
        const generarIdUnico = (index: number) => {
            const timestamp = Date.now().toString().slice(-5); // Últimos 5 dígitos del timestamp
            return `ACT-${timestamp}${index}`.slice(0, 10); // Aseguramos que sea varchar(10)
        };

        const registros = tipo === 'lote'
            ? Array.from({ length: formData.cantidad }).map((_, index) => ({
                id_act: generarIdUnico(index), // Generar ID único por cada registro
                nom_act: formData.nombre,
                mar_act: formData.marca,
                mod_act: formData.modelo,
                serie_act: formData.serie,
                pro_per: formData.proveedor,
                ubi_act_per: formData.ubicacion,
                estado: formData.estado,
                fecha_compra: fechaCompra,
                registrado_por: formData.registrado_por,
                responsable: formData.responsable,
                tipo_activo: formData.tipo_activo,
            }))
            : [{
                id_act: generarIdUnico(0), // Generar un único ID para registro individual
                nom_act: formData.nombre,
                mar_act: formData.marca,
                mod_act: formData.modelo,
                serie_act: formData.serie,
                pro_per: formData.proveedor,
                ubi_act_per: formData.ubicacion,
                estado: formData.estado,
                fecha_compra: fechaCompra,
                registrado_por: formData.registrado_por,
                responsable: formData.responsable,
                tipo_activo: formData.tipo_activo,
            }];

        try {
            const response = await fetch('http://localhost:3000/api/registro-activos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registros),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el registro');
            }

            alert('Activos creados exitosamente!');
            setFormData({
                id_act: '', // Limpiar el ID después del envío
                registrado_por: 1,
                nombre: '',
                marca: '',
                modelo: '',
                serie: '',
                ubicacion: '',
                estado: '',
                responsable: '',
                proveedor: '',
                tipo_activo: '',
                cantidad: 1,
            });
            window.location.reload();
        } catch (error) {
            alert('Registro creado con éxito');
            console.error(error);
        }
    };



    return (
        <div className="nuevoBo">
            <Navbar />
            <div className="crear-activo-container">
                <h2 className="crear-activo-title">Crear Activo - {tipo === 'lote' ? 'Por Lote' : 'Individual'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Marca:</label>
                        <input
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Modelo:</label>
                        <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Serie:</label>
                        <input
                            type="text"
                            name="serie"
                            value={formData.serie}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <Combobox
                            label="Ubicación"
                            endpoint="http://localhost:3000/api/ubicaciones"
                            valueField="id_ubi"
                            displayFormat={(ubicacion) => `${ubicacion.edi_ubi} - Piso ${ubicacion.piso_ubi} - Lab ${ubicacion.num_lab_ubi}`}
                            onChange={(value) => handleComboboxChange('ubicacion', value)}
                        />
                    </div>
                    <div className="form-field">
                        <label>Estado:</label>
                        <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione el estado</option>
                            <option value="Nuevo">Nuevo</option>
                            <option value="Usado">Usado</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <label>Tipo de Activo:</label>
                        <select
                            name="tipo_activo"
                            value={formData.tipo_activo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione el tipo de activo</option>
                            <option value="Inmobiliario">Inmobiliario</option>
                            <option value="Electronico">Electronico</option>
                        </select>
                    </div>
                    <div className="form-field">
                        <Combobox
                            label="Responsable"
                            endpoint="http://localhost:3000/api/responsables"
                            valueField="id_res"
                            displayField="nom_res"
                            onChange={(value) => handleComboboxChange('responsable', value)}
                        />
                    </div>
                    <div className="form-field">
                        <Combobox
                            label="Proveedor"
                            endpoint="http://localhost:3000/api/proveedores"
                            valueField="id_pro"
                            displayField="nom_pro"
                            onChange={(value) => handleComboboxChange('proveedor', value)}
                        />
                    </div>
                    {tipo === 'lote' && (
                        <div className="form-field">
                            <label>Cantidad:</label>
                            <input
                                type="number"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Crear Activo</button>
                </form>
            </div>
        </div>
    );
};

export default CrearActivo;
