import { useEffect, useState, useMemo } from "react";
import { useFilters } from "../FiltersContext";

function Select({ endPoint, depsUseEffect = [], defaultValue = { id: "", name: "Seleccione" }, ...props }) {
    const [opciones, setOpciones] = useState([]);
    const { filters, buildQuery } = useFilters();
    const params = useMemo(() => buildQuery() || null, [buildQuery]);

    // if (!depsUseEffect.length) {
    //     depsUseEffect
    // }

    useEffect(() => {
        fetch("http://localhost:8000" + endPoint + (params ? `?${params}` : ""))
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