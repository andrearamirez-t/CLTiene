import React, { useState } from 'react';
import { useFilters } from '../../FiltersContext';

const BusquedaInteligente = () => {
    const { buildQuery } = useFilters();
    const params = buildQuery() || null

    const [inputValue, setInputValue] = useState('');
    const [palabraEnAlerta, setPalabraEnAlerta] = useState('');

    const [resultados, setResultados] = useState([]);
    const [haBuscado, setHaBuscado] = useState(false);
    const [itemAbierto, setItemAbierto] = useState(null);

    const [loading, setLoading] = useState(false);

    const ejecutarBusqueda = async () => {

        const query = inputValue.trim();
        if (!query) return;

        setLoading(true);
        setPalabraEnAlerta(query);
        setItemAbierto(null);

        try {

            const response = await fetch("http://localhost:8000/api/busqueda_inteligente" + (params ? `?${params}` : ""), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: query
                })
            });

            const data = await response.json();

            setResultados(data.resultados || []);
            setHaBuscado(true);

        } catch (error) {

            console.error("Error en búsqueda:", error);
            setResultados([]);
            setHaBuscado(true);

        }

        setLoading(false);
    };

    return (
        <div style={{ padding: '20px' }}>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && ejecutarBusqueda()}
                    placeholder="Ej: precio, mascotas..."
                    style={{ flex: 1, padding: '14px', borderRadius: '10px', backgroundColor: '#1e293b', color: 'white', border: 'none' }}
                />
                <button onClick={ejecutarBusqueda} style={{ width: '180px', backgroundColor: '#FC3276', color: 'white', borderRadius: '25px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    🔎 Buscar
                </button>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '15px', color: '#e91e63' }}>
                        Buscando en transcripciones...
                    </div>
                )}
            </div>

            {haBuscado && (
                <div style={{
                    backgroundColor: resultados.length > 0 ? '#f0fdf4' : '#fefce8',
                    padding: '12px', borderRadius: '8px', marginBottom: '15px',
                    color: resultados.length > 0 ? '#166534' : '#854d0e',
                    border: '1px solid' + (resultados.length > 0 ? '#bbf7d0' : '#fef08a')
                }}>
                    {resultados.length > 0
                        ? `✅ ${resultados.length} resultados para '${palabraEnAlerta}'`
                        : `⚠️ Sin resultados para '${palabraEnAlerta}'`}
                </div>
            )}


            {resultados.map((res, index) => (
                <div key={res.id} style={{ marginBottom: '10px' }}>
                    <div
                        onClick={() => setItemAbierto(itemAbierto === index ? null : index)}
                        style={{ backgroundColor: '#FC3276', color: 'white', padding: '12px 20px', borderRadius: itemAbierto === index ? '10px 10px 0 0' : '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    >
                        <span>{res.id} | {res.estado} | {res.plan} | Cal:{res.cal}</span>
                        <span>{itemAbierto === index ? '▲' : '▼'}</span>
                    </div>


                    {itemAbierto === index && (
                        <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#fafafa', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', fontSize: '13px' }}>
                            <div>
                                <p><strong>Resultado:</strong> {res.estado}</p>
                                <p><strong>Duración:</strong> {res.detalle.duracion}</p>
                                <p><strong>Turnos:</strong> {res.detalle.turnos}</p>
                            </div>
                            <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                                <p><strong>[Cliente]:</strong> {res.detalle.cliente}</p>
                                <p style={{ marginTop: '10px' }}><strong>[Asesor]:</strong> {res.detalle.asesor}</p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BusquedaInteligente;