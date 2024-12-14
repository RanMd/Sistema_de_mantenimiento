import React, { useState, useEffect } from "react";
import axios from "axios";

interface ComboboxProps {
    label: string; // Etiqueta del combobox
    endpoint: string; // URL del API para obtener los datos
    valueField: string; // Campo que se usará como "value" en las opciones
    displayField?: string; // Opcional si usas displayFormat
    displayFormat?: (option: any) => string; // Función para personalizar el texto
    onChange?: (value: string) => void; // Función para manejar el valor seleccionado
}

const Combobox: React.FC<ComboboxProps> = ({
    label,
    endpoint,
    valueField,
    displayField = valueField, // Predeterminado al valueField
    displayFormat,
    onChange,
}) => {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(endpoint);
                setOptions(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar datos: " + (err as Error).message);
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    if (loading) return <p>Cargando {label}...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <label>{label}:</label>
            <select
                onChange={(e) => onChange && onChange(e.target.value)} // Manejar cambios
            >
                <option value="">Seleccione una opción</option>
                {options.map((option) => (
                    <option key={option[valueField]} value={option[valueField]}>
                        {displayFormat
                            ? displayFormat(option)
                            : option[displayField || valueField]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Combobox;
