import { useEffect, useState } from 'react';
import { useFilters } from '../FiltersContext';

function Select({ endPoint, selected = null, defaultValue = { id: "", name: "Seleccione" }, ...props }) {
    const [opciones, setOpciones] = useState([]);

    // Todos los campos tienen los filtros del "Sidebar" -> todo filtra todo
    const { buildQuery } = useFilters();
    const params = buildQuery() || null

    useEffect(() => {
        fetch("http://localhost:8000" + endPoint + (params ? `?${params}` : ""))
            .then(res => res.json())
            .then(data => setOpciones(Array.isArray(data) ? data : []));
    }, []);

    return (
        <select {...props}>
            <option value={defaultValue?.id}>{defaultValue?.name}</option>
            {Array.isArray(opciones) &&
                opciones.map(opcion => (
                    <option key={opcion.id}>{opcion.name}</option>
                ))
            }
        </select>
    );
}

export default Select;