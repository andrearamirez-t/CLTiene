import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

const EMPTY_FILTERS = {
    fecha_desde: null,
    fecha_hasta: null,
    resultado_llamada: null,
    plan_mencionado: null,
    duracion_llamada: null,
    saludo_asesor: null,
    nombre_asesor: null,
    modulo_atencion: null,
    clasificacion_sentimiento: null,
    tipo_llamada: null,
    seguimiento_llamada: null,
    asistencia_mencionada: null,
    transcripcion: null
};

export const FiltersProvider = ({ children }) => {
    const [filters, setFilters] = useState({ ...EMPTY_FILTERS });

    const buildQuery = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== "")
        );

        return new URLSearchParams(cleanFilters).toString();
    };

    const resetFilters = () => setFilters({ ...EMPTY_FILTERS });

    return (
        <FiltersContext.Provider value={{ filters, setFilters, buildQuery, resetFilters }}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFilters = () => useContext(FiltersContext);
