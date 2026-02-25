function Resumen() {

    const resultados = [
        { nombre: "Contactado", valor: "1.322 (40.1%)", ancho: "90%" },
        { nombre: "Sin Contacto", valor: "753 (22.8%)", ancho: "60%" },
        { nombre: "Sin Clasificar", valor: "624 (18.9%)", ancho: "50%" },
        { nombre: "Buzón de Voz", valor: "205 (6.2%)", ancho: "25%" },
        { nombre: "Rechazado", valor: "168 (5.1%)", ancho: "20%" },
        { nombre: "Venta", valor: "62 (1.9%)", ancho: "10%" },
    ];

    const datosDuracion = [
        { label: "Buzón", altura: "140px", valor: "753", color: "linear-gradient(to top, #EE7553, #E83A75)" },
        { label: "Muy Corta", altura: "80px", valor: "490", color: "linear-gradient(to top, #EE7553, #E83A75)" },
        { label: "Corta", altura: "160px", valor: "733", color: "linear-gradient(to top, #EE7553, #E83A75)" },
        { label: "Media", altura: "190px", valor: "1,017", color: "linear-gradient(to top, #EE7553, #E83A75)" },
        { label: "Larga", altura: "60px", valor: "306", color: "linear-gradient(to top, #EE7553, #E83A75)" },
    ];

    const colorGradient = { background: 'linear-gradient(45deg, #634394, #5181C2)' }

    return (
        <div className="dashboard-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                    <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9' }}>Distribución de Resultados</div>
                    {resultados.map((res, i) => (
                        <div key={i} className="h-chart-row">
                            <div className="h-label">{res.nombre}</div>
                            <div className="h-bar-bg"><div className="h-bar-fill" style={{ width: res.ancho }}>{res.valor}</div></div>
                        </div>
                    ))}
                </div>
                <div className="card">
                    <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9' }}>Distribución por Duración</div>
                    <div className="v-chart-container">
                        {datosDuracion.map((item, i) => (
                            <div key={i} className="v-bar-wrapper">
                                <div className="v-bar" style={{ height: item.altura, background: item.color }}><span className="v-bar-text">{item.valor}</span></div>
                                <span className="v-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="card">
                    <div className="card-title" style={{ borderBottom: '1px solid #f1f5f9' }}>Embudo de conversión</div>
                    <div className="funnel-step" style={{ ...colorGradient, ...{ width: "98%" } }}><span>Total</span><span>3,299</span></div>
                    <div className="funnel-step" style={{ ...colorGradient, ...{ width: '95%' } }}><span>Contestadas</span><span>3,298</span></div>
                    <div className="funnel-step" style={{ ...colorGradient, ...{ width: '75%' } }}><span>Efectivas</span><span>185</span></div>
                    <div className="funnel-step" style={{ ...colorGradient, ...{ width: '55%' } }}><span>Ventas</span><span>62</span></div>
                </div>
                <div className="card" style={{ background: '#fff1f2', borderColor: '#fecdd3' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#be123c' }}>Insights con IA</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                        <li>Las llamadas de duración "Media" generan el 60% de las ventas.</li>
                        <li>El rendimiento ha subido un 5% respecto a la semana pasada.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Resumen