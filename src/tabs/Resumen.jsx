import React, { useEffect, useState } from "react";
import ResultadosChart from "../components/charts/ResultadosChart";
import EmbudoChart from "../components/charts/EmbudoChart";
import DuracionChart from "../components/charts/DuracionChart";
import InsightsCard from "../components/ui/InsightsCard";
import { useFilters } from "../FiltersContext";

function Resumen() {
    const { filters, buildQuery } = useFilters();
    const [results, setResults] = useState([])

    useEffect(() => {
        const params = buildQuery() || null
        fetch(`http://localhost:8000/api/distribucion_resultado${(params ? `?${params}` : "")}`)
            .then(res => res.json())
            .then(data => setResults(data));
    }, [filters]);

    const resultados = results

    return (
        <div className="dashboard-grid">

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ResultadosChart datos={resultados} />
                <DuracionChart />
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <EmbudoChart />
                <InsightsCard />
            </div>
        </div>
    );
}

export default Resumen;