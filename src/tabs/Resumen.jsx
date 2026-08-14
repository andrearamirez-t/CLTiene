import { API_BASE } from '../config';
import React, { useEffect, useState } from "react";
import ResultadosChart from "../components/charts/ResultadosChart";
import EmbudoChart from "../components/charts/EmbudoChart";
import DuracionChart from "../components/charts/DuracionChart";
import EstatusChart from "../components/charts/EstatusChart";
import InsightsCard from "../components/ui/InsightsCard";
import { useFilters } from "../FiltersContext";

function Resumen() {
    const { filters, buildQuery } = useFilters();
    const [results, setResults] = useState([])

    useEffect(() => {
        const params = buildQuery() || null;

        fetch(`${API_BASE}/api/distribucion_resultado${params ? `?${params}` : ""}`)
            .then(res => res.json())
            .then(data => {
                setResults(Array.isArray(data) ? data : []);
            })
            .catch(() => setResults([]));
    }, [filters]);

    const esServicio = filters.tipo_llamada?.toLowerCase() === 'servicio';
    const resultados = esServicio ? results.filter(r => r.nombre !== 'Venta') : results;

    return (
        <div className="dashboard-grid">

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ResultadosChart datos={resultados} />
                <DuracionChart />
                <EstatusChart />
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <EmbudoChart />
                <InsightsCard />
            </div>
        </div>
    );
}

export default Resumen;