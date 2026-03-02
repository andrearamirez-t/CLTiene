function Inteligencia() {

    return <div className="operativa-view" style={{ padding: '20px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* HORA Y DÍA */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>

            {/* RENDIMIENTO POR HORA */}
            <div className="card" style={{ flex: 1, minWidth: '450px', padding: '15px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '30px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Rendimiento por Hora</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 35px 40px 35px' }}>
                    <div style={{ position: 'absolute', top: '-25px', left: '0', display: 'flex', gap: '15px', fontSize: '10px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '10px', height: '10px', backgroundColor: '#e11d48' }}></div> Total Llamadas
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '10px', height: '2px', backgroundColor: '#10b981' }}></div> % Efectivas
                        </span>
                    </div>
                    <div style={{ position: 'absolute', left: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#999' }}>
                        <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span>
                    </div>
                    <div style={{ position: 'absolute', right: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>
                        <span>0</span><span>10</span><span>20</span><span>30</span><span>40</span><span>50</span>
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 1 }}>
                        {[0, 0, 0, 2, 1, 5, 215, 413, 317, 487, 361, 139, 321, 370, 354, 150, 55, 10, 21, 15, 5, 2].map((v, i) => (
                            <div key={i} style={{ width: '3%', height: `${(v / 500) * 100}%`, backgroundColor: '#e11d48' }}></div>
                        ))}
                    </div>
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, overflow: 'visible' }}>
                        <polyline points="0,220 30,218 60,10 90,210 120,205 150,200 180,190 210,200 240,210 270,215 300,220" fill="none" stroke="#10b981" strokeWidth="2" />
                        <text x="50" y="25" fill="#10b981" fontSize="10" fontWeight="bold">50.0%</text>
                        <text x="140" y="185" fill="#10b981" fontSize="9">5.3%</text>
                    </svg>
                    <div style={{ position: 'absolute', bottom: '-20px', width: '100%', textAlign: 'center', fontSize: '10px', color: '#999' }}>Hora</div>
                </div>
            </div>

            {/* RENDIMIENTO POR DÍA */}
            <div className="card" style={{ flex: 1, minWidth: '450px', padding: '15px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '30px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Rendimiento por Día</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 35px 40px 35px' }}>
                    <div style={{ position: 'absolute', left: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#999' }}>
                        <span>0</span><span>200</span><span>400</span><span>600</span><span>800</span>
                    </div>
                    <div style={{ position: 'absolute', right: '-35px', height: '100%', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>
                        <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 1 }}>
                        {[{ d: 'Lun', v: 528 }, { d: 'Mar', v: 558 }, { d: 'Mie', v: 411 }, { d: 'Jue', v: 462 }, { d: 'Vie', v: 831 }, { d: 'Sab', v: 425 }, { d: 'Dom', v: 84 }].map((day, i) => (
                            <div key={i} style={{ width: '12%', height: `${(day.v / 900) * 100}%`, backgroundColor: '#e11d48', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                                <span style={{ color: 'white', fontSize: '9px', fontWeight: 'bold' }}>{day.v}</span>
                                <span style={{ position: 'absolute', bottom: '-20px', fontSize: '10px', color: '#666' }}>{day.d}</span>
                            </div>
                        ))}
                    </div>
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, overflow: 'visible' }}>
                        <polyline points="20,200 80,160 140,120 200,90 260,130 320,170 380,30" fill="none" stroke="#10b981" strokeWidth="2" />
                        <circle cx="200" cy="90" r="3" fill="#10b981" />
                        <text x="190" y="80" fill="#10b981" fontSize="10" fontWeight="bold">7.1%</text>
                        <circle cx="380" cy="30" r="3" fill="#10b981" />
                        <text x="370" y="20" fill="#10b981" fontSize="10" fontWeight="bold">8.3%</text>
                    </svg>
                </div>
            </div>
        </div>

        {/* VENTAS VS SERVICIO Y SUBJETIVIDAD */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Ventas vs Servicio</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', paddingLeft: '60px' }}>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#e11d48' }}></div> Total</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#10b981' }}></div> Efectivas</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[{ label: 'ventas', total: 813, efec: 53, tW: '45%', eW: '10%' }, { label: 'servicio', total: 706, efec: 38, tW: '40%', eW: '8%' }, { label: 'mixto', total: 1780, efec: 94, tW: '95%', eW: '15%' }].map((item, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '-60px', top: '10px', fontSize: '11px', color: '#666' }}>{item.label}</span>
                                <div style={{ height: '18px', width: item.eW, backgroundColor: '#10b981', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '0 2px 2px 0' }}>{item.efec}</div>
                                <div style={{ height: '18px', width: item.tW, backgroundColor: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10px', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '0 2px 2px 0' }}>{item.total}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card" style={{ flex: 1, padding: '15px', minWidth: '450px' }}>
                <div style={{ borderBottom: '1px solid #3b82f6', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Subjetividad vs Confianza</h4>
                </div>
                <div style={{ position: 'relative', height: '220px', margin: '0 40px' }}>
                    <div style={{ position: 'absolute', right: '-10px', top: '0', fontSize: '10px' }}>
                        <div style={{ color: '#ccc' }}>Módulo</div>
                        <div style={{ color: '#fda4af' }}>● ASISTENCIA</div>
                        <div style={{ color: '#6ee7b7' }}>● CRM</div>
                    </div>
                    <div style={{ position: 'absolute', left: '-30px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '10px', color: '#999' }}>
                        <span>1</span><span>0</span><span>-1</span>
                    </div>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', borderBottom: '1px solid #eee' }}>
                        <div style={{ position: 'absolute', top: '50%', width: '100%', borderTop: '1.5px solid #333' }}></div>
                    </div>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', backgroundColor: 'white', border: '2px solid #10b981', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}></div>
                </div>
            </div>
        </div>

        {/* DESEMPEÑO Y EVOLUCIÓN */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
            
            
            <div className="card" style={{ flex: 1, padding: '20px', minWidth: '550px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ borderBottom: '2px solid #3b82f6', marginBottom: '25px', paddingBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Desempeño y Sentimiento por Asesor</h4>
                </div>

                <div style={{ height: '280px', display: 'flex', flexDirection: 'column' }}>
                    
                    
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '10px', borderBottom: '1px solid #cbd5e1' }}>
                        {[
                            'Angie Daniela', 'Dayana Alex.', 'Edwin Cendales', 'Jenifer Andrea',
                            'Jimmy Rusinque', 'Johan Casallas', 'Marjorie Vill.', 'Melany Camila', 'Nicolas Steven'
                        ].map((name, i) => (
                            <div key={i} style={{ width: '8%', height: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                {/* La Barra Morada */}
                                <div style={{ width: '100%', height: '100%', backgroundColor: '#634394', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'all 0.3s' }}>
                                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>100%</span>
                                </div>

                                
                                <div style={{
                                    position: 'absolute',
                                    top: '110%',
                                    left: '50%',
                                    transform: 'rotate(-45deg) translateX(-100%)',
                                    transformOrigin: 'top left',
                                    whiteSpace: 'nowrap',
                                    fontSize: '10px',
                                    color: '#64748b',
                                    textAlign: 'right',
                                    width: '120px'
                                }}>
                                    {name}
                                </div>
                            </div>
                        ))}
                    </div>
                    

                    <div style={{ height: '60px' }}></div>
                </div>
            </div>

            {/* Evolución de Ventas */}
            <div className="card" style={{ flex: 1, padding: '20px', minWidth: '550px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ borderBottom: '2px solid #3b82f6', marginBottom: '25px', paddingBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Evolución de Ventas en el Tiempo</h4>
                </div>
                {/* Contenido de la gráfica de líneas */}
                <div style={{ height: '280px', position: 'relative' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#db2777', borderRadius: '50%' }}></div> Ingresos</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div> Ventas</span>
                    </div>
                    <svg viewBox="0 0 400 180" preserveAspectRatio="none" style={{ width: '100%', height: '70%' }}>
                        <path d="M0,130 L100,90 L200,40 L300,100 L400,90 V180 H0 Z" fill="#fdf2f8" />
                        <polyline points="0,130 100,90 200,40 300,100 400,90" fill="none" stroke="#db2777" strokeWidth="3" />
                        <circle cx="100" cy="90" r="4" fill="#db2777" />
                        <circle cx="200" cy="40" r="4" fill="#db2777" />
                        <circle cx="300" cy="100" r="4" fill="#db2777" />
                    </svg>
                </div>
            </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
            <div className="card" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>

                <div style={{ borderBottom: '2px solid #3b82f6', marginBottom: '25px', paddingBottom: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>⏱ Duración vs Efectividad</h4>
                </div>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

                    {/* SECCIÓN DE BARRAS DELGADAS */}
                    <div style={{ flex: '0 0 65%', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '12px', height: '12px', backgroundColor: '#e91e63' }}></div> Total</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '15px', height: '2px', backgroundColor: '#10b981' }}></div> % Efectivas</span>
                        </div>

                        {/* El contenedor de barras  */}
                        <div style={{
                            height: '250px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                            borderBottom: '1px solid #cbd5e1',
                            position: 'relative',
                            paddingBottom: '5px'
                        }}>
                            {[
                                { label: 'Buzón', total: 753, ef: '0.0%' },
                                { label: 'Muy Corta', total: 490, ef: '0.0%' },
                                { label: 'Corta', total: 733, ef: '0.0%' },
                                { label: 'Media', total: 1017, ef: '3.3%' },
                                { label: 'Larga', total: 306, ef: '49.4%' }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    width: '50px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    position: 'relative'
                                }}>
                                    
                                    {/* Valor numérico sobre la barra */}
                                    <span style={{ fontSize: '10px', color: '#64748b', marginBottom: '5px' }}>{item.total}</span>


                                    <div style={{
                                        width: '100%',
                                        height: `${(item.total / 1100) * 100}%`, 
                                        backgroundColor: '#e91e63',
                                        borderRadius: '3px 3px 0 0'
                                    }}></div>

                                    {/* Etiqueta inferior */}
                                    <span style={{ position: 'absolute', bottom: '-25px', fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}

                            {/* Línea Verde */}
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
                                <polyline
                                    points="45,230 135,230 225,230 315,210 405,40"
                                    fill="none" stroke="#10b981" strokeWidth="2.5"
                                />
                                {[45, 135, 225, 315, 405].map((x, idx) => (
                                    <circle key={idx} cx={x} cy={idx === 4 ? 40 : (idx === 3 ? 210 : 230)} r="4" fill="#10b981" />
                                ))}
                            </svg>
                        </div>
                        <div style={{ height: '30px' }}></div> 
                    </div>

                    {/* SECCIÓN SENTIMIENTO */}
                    <div style={{ flex: '0 0 35%', textAlign: 'center' }}>
                        <h5 style={{ fontSize: '13px', marginBottom: '15px' }}>** Clasificación de Sentimiento **</h5>
                        <div style={{
                            width: '250px', height: '250px',
                            backgroundColor: '#634394',
                            borderRadius: '50%',
                            margin: '0 auto',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            color: 'white'
                        }}>
                            <span style={{ fontSize: '12px' }}>neutro</span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}

export default Inteligencia