import { API_BASE } from '../config';
import { useEffect, useState, useMemo } from "react";
import { useFilters } from "../FiltersContext";

function Select({ endPoint, depsUseEffect = [], defaultValue = { id: "", name: "Seleccione" }, ...props }) {
    const [opciones, setOpciones] = useState([]);
    const { filters, setFilters } = useFilters();

    const params = useMemo(() => {
        const nombre = props.name;
        const sinPropio = Object.fromEntries(
            Object.entries(filters).filter(([k, v]) => k !== nombre && v !== null && v !== "")
        );
        return new URLSearchParams(sinPropio).toString() || null;
    }, [filters, props.name]);

    useEffect(() => {
        fetch(API_BASE + endPoint + (params ? `?${params}` : ""))
            .then(res => res.json())
            .then(data => setOpciones(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <select {...props}>
            <option value={defaultValue?.id}>{defaultValue?.name}</option>
            {opciones.map(opcion => (
                <option key={opcion.id} value={opcion.id}>
                    {opcion.name}
                </option>
            ))}
        </select>
    );
}

export default Select;