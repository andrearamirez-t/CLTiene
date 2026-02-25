function Sidebar() {
    return (
        <aside className="sidebar">
            <h2 style={{ fontSize: '20px', marginBottom: '30px' }}>CLTIENE</h2>
            <div style={{ fontSize: '12px' }}>
                <p style={{ marginBottom: '5px' }}>PERIODO</p>
                <input type="date" defaultValue="2023-11-28" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px', marginBottom: '10px' }} />
                <input type="date" defaultValue="2024-02-23" style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px' }} />
            </div>
        </aside>
    )
}


export default Sidebar