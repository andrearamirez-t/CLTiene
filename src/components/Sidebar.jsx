function Sidebar() {
    const customInput = { width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px', marginBottom: '10px' }
    const labelMargin = { marginBottom: "1rem" }

    return (
        <aside className="sidebar">
            <h2 style={{ fontSize: '20px', marginBottom: '30px' }}>CLTIENE</h2>
            <div style={{ fontSize: '12px' }}>
                <p style={{ marginBottom: '5px' }}>PERIODO</p>
                <input type="date" defaultValue="2023-11-28" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px', marginBottom: '10px' }} />
                <input type="date" defaultValue="2024-02-23" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} />
                <hr />
                <p style={{ marginBottom: '5px' }}>FILTROS</p>
                <label style={labelMargin}>Resultado de la Llamada</label><select style={customInput}></select>
                <label style={labelMargin}>Plan Mencionado</label><select style={customInput}></select>
                <label style={labelMargin}>Duración de la Llamada</label><select style={customInput}></select>
                <label style={labelMargin}>Saludo del Asesor</label><select style={customInput}></select>
                <label style={labelMargin}>Nombre del Asesor</label><select style={customInput}></select>
                <label style={labelMargin}>Módulo de Atención</label><select style={customInput}></select>
                <label style={labelMargin}>Clasificación del Sentimiento</label><select style={customInput}></select>
                <label style={labelMargin}>Tipo de Llamada</label><select style={customInput}></select>
            </div>
        </aside>
    )
}


export default Sidebar