import React, { useState } from 'react';

const BusquedaInteligente = () => {
    
    const [inputValue, setInputValue] = useState('');
    const [palabraEnAlerta, setPalabraEnAlerta] = useState(''); 
    
    const [resultados, setResultados] = useState([]);
    const [haBuscado, setHaBuscado] = useState(false);
    const [itemAbierto, setItemAbierto] = useState(null);

    const baseDatos = [
        { 
            id: "#15555", 
            keyword: "mascota", 
            estado: "Contactado", 
            plan: "Plan Mascotas", 
            cal: 50,
            detalle: {
                duracion: "Media",
                turnos: 12,
                cliente: "Aló, buenos días. Muy buenos días. ¿Si me escuchan?",
                asesor: "Tengo el gusto de comunicarme con Luz Torres. Le hablo de su servicio asistencial para perritos y gatitos."
            }
        },
        { 
            id: "#19579", 
            keyword: "precio", 
            estado: "Venta", 
            plan: "No identificado", 
            cal: 10,
            detalle: {
                duracion: "Larga",
                turnos: 8,
                cliente: "Pero es súper costoso. Sí, señores...",
                asesor: "Hola, muy buenos días. El excedente sería de 70 mil."
            }
        }
    ];

    const ejecutarBusqueda = () => {
        const query = inputValue.toLowerCase().trim();
        
        if (query === "") return;

        
        setPalabraEnAlerta(inputValue); 
        
        const filtrados = baseDatos.filter(item => 
            item.keyword.includes(query) || item.plan.toLowerCase().includes(query)
        );

        setResultados(filtrados);
        setHaBuscado(true);
        setItemAbierto(null); 
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
                <button onClick={ejecutarBusqueda} style={{ width: '180px', backgroundColor: '#e91e63', color: 'white', borderRadius: '25px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    🔎 Buscar
                </button>
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

            {/* Lista de Resultados Desplegables */}
            {resultados.map((res, index) => (
                <div key={res.id} style={{ marginBottom: '10px' }}>
                    <div 
                        onClick={() => setItemAbierto(itemAbierto === index ? null : index)}
                        style={{ backgroundColor: '#e91e63', color: 'white', padding: '12px 20px', borderRadius: itemAbierto === index ? '10px 10px 0 0' : '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    >
                        <span>{res.id} | {res.estado} | {res.plan} | Cal:{res.cal}</span>
                        <span>{itemAbierto === index ? '▲' : '▼'}</span>
                    </div>

                    {/* Información Desplegada */}
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