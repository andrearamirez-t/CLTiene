import { createContext, useContext, useState } from "react";

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
    const [filters, setFilters] = useState({
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
        asistencia_mencionada: null,
        transcripcion: null
    });

    const buildQuery = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== "")
        );

        return new URLSearchParams(cleanFilters).toString();
    };

    return (
        <FiltersContext.Provider value={{ filters, setFilters, buildQuery }}>
            {children}
        </FiltersContext.Provider>
    );
};

export const useFilters = () => useContext(FiltersContext);
