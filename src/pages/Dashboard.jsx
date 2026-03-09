import React, { useState } from 'react';

import Sidebar from '../layout/Sidebar.jsx'; 
import { 
    Phone, Download, CheckCircle, DollarSign, 
    Clock, Calendar, Trophy, Star, Handshake 
} from 'lucide-react';


import Resumen from '../tabs/Resumen';
import Rendimiento from '../tabs/Rendimiento';
import Analisis from '../tabs/Analisis';
import Inteligencia from '../tabs/Inteligencia';
import Transcripciones from '../tabs/Transcripciones';
import Agente from '../tabs/Agente';

const Dashboard = () => {
    const [tabActiva, setTabActiva] = useState('Resumen Ejecutivo');
    const tabs = [
        'Resumen Ejecutivo', 
        'Rendimiento Asesores', 
        'Análisis Detallado', 
        'Inteligencia Operativa', 
        'Transcripciones', 
        'Agente IA PRO'
    ];

    return (
        <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            
            <Sidebar />

            
            <main className="main" style={{ flex: 1, padding: '20px', overflowY: 'auto', marginLeft:"260px" }}>
                
                
                <header className="header-banner" style={{ 
                    background: 'linear-gradient(90deg, #be123c 0%, #7e22ce 100%)',
                    padding: '30px',
                    borderRadius: '12px',
                    color: 'white',
                    marginBottom: '20px'
                }}>
                    <h1 style={{ margin: 0, fontSize: '25px', fontWeight: 'bold' }}>
                        Rendimiento de Asesores y Éxito de Llamadas
                    </h1>
                    <p style={{ margin: '5px 0 0', opacity: 0.9 }}>Validación y seguimiento de datos con IA</p>
                </header>

               
                <section style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
                    gap: '12px', 
                    marginBottom: '20px' 
                }}>
                    {[
                        { icon: <Phone size={18} />, label: 'TOTAL', value: '3,299' },
                        { icon: <Download size={18} />, label: 'CONTESTADAS', value: '3,298' },
                        { icon: <CheckCircle size={18} />, label: 'EFECTIVAS', value: '185' },
                        { icon: <DollarSign size={18} />, label: 'VENTAS', value: '62' },
                        { icon: <Clock size={18} />, label: 'HORA', value: '9:00' },
                        { icon: <Calendar size={18} />, label: 'DÍA', value: 'Viernes' },
                        { icon: <Trophy size={18} />, label: 'TOP', value: 'Jennifer' },
                        { icon: <Star size={18} />, label: 'SALUDO', value: '7%' },
                        { icon: <Handshake size={18} />, label: 'CALIDAD', value: '12/100' }
                    ].map((item, index) => (
                        <div key={index} style={{
                            backgroundColor: 'white',
                            padding: '15px 10px',
                            borderRadius: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <div style={{ color: '#be123c', marginBottom: '8px' }}>{item.icon}</div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#3a3d3a', marginBottom: '4px' }}>
                                {item.label}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b' }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </section>

                
                <nav className="tabs-container" style={{ marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                    {tabs.map(tab => (
                        <button 
                            key={tab} 
                            className={`tab-button ${tabActiva === tab ? 'active' : ''}`} 
                            onClick={() => setTabActiva(tab)}
                            style={{
                                padding: '10px 15px',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                color: tabActiva === tab ? '#be123c' : '#64748b',
                                borderBottom: tabActiva === tab ? '2px solid #be123c' : 'none',
                                fontWeight: tabActiva === tab ? 'bold' : 'normal',
                                fontSize: '14px'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                
                <div className="tab-content" style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {tabActiva === "Resumen Ejecutivo" && <Resumen />}
                    {tabActiva === "Rendimiento Asesores" && <Rendimiento />}
                    {tabActiva === "Análisis Detallado" && <Analisis />}
                    {tabActiva === "Inteligencia Operativa" && <Inteligencia />}
                    {tabActiva === "Transcripciones" && <Transcripciones />}
                    {tabActiva === "Agente IA PRO" && <Agente />}
                </div>

                {/* FOOTER */}
                <footer style={{ marginTop: '40px', padding: '20px 0', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#41454d' }}>CL Tiene Soluciones - Analytics Dashboard</h3>
                    <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#94a3b8' }}>© 2026 Todos los derechos reservados</p>
                </footer>
            </main>
        </div>
    );
};

export default Dashboard;