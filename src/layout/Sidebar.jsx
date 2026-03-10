import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../FiltersContext';
import Select from '../components/Select';

function Sidebar() {
    const { filters, setFilters } = useFilters();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const customInput = {
        width: '100%',
        padding: '9px',
        background: '#1e293b',
        border: '1px solid #334155',
        color: 'white',
        borderRadius: '5px',
        marginBottom: '20px',
        fontSize: '12px'
    }

    const labelMargin = {
        marginBottom: "8px",
        display: 'block',
        fontSize: '11px',
        color: '#94a3b8',
        fontWeight: '500'
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    return (
        <>
            <button
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    left: isOpen ? '260px' : '0px',
                    top: '20px',
                    zIndex: 1100,
                    background: '#1e293b',
                    color: 'white',
                    border: '1px solid #334155',
                    borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 6px',
                    cursor: 'pointer',
                    transition: 'left 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
                }}
            >
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {isOpen ? '«' : '»'}
                </span>
            </button>

            {/* SIDEBAR */}
            <aside className="sidebar" style={{
                width: '260px',
                height: '100vh',
                position: 'fixed',
                left: isOpen ? 0 : '-260px',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                background: '#0f172a',
                padding: '20px',
                borderRight: '1px solid #1e293b',
                zIndex: 1000,
                transition: 'left 0.3s ease',
                boxShadow: isOpen ? '5px 0 15px rgba(0,0,0,0.3)' : 'none'
            }}>
                {/* LOGO */}
                <div style={{
                    padding: '20px 0 40px 0',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexShrink: 0
                }}>
                    <img style={{ width: "10rem" }} src="src/assets/logo_cl_tiene.png" alt="Logo cl tiene" />
                </div>


                <div className="scroll-filters" style={{
                    fontSize: '12px',
                    flexGrow: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    paddingRight: '10px',
                }}>
                    <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#64748b', fontSize: '12px', letterSpacing: '1px' }}>PERIODO</p>
                    <label style={labelMargin}>Desde</label>
                    <input type="date" onChange={handleChange} name='fecha_desde' style={customInput} />
                    <label style={labelMargin}>Hasta</label>
                    <input type="date" onChange={handleChange} name='fecha_hasta' style={customInput} />

                    <hr style={{ border: 'none', height: '1px', background: '#1e293b', margin: '20px 0' }} />

                    <p style={{ marginBottom: '15px', fontWeight: 'bold', color: '#64748b', fontSize: '12px', letterSpacing: '1px' }}>FILTROS</p>

                    <label style={labelMargin}>Resultado de la Llamada</label>
                    {/* <select style={customInput}><option>Todas</option></select> */}
                    <Select onChange={handleChange} name="resultado_llamada" style={customInput} endPoint="/api/resultado_llamada" />

                    <label style={labelMargin}>Plan Mencionado</label>
                    {/* <select style={customInput}><option>Todos</option></select> */}
                    <Select onChange={handleChange} name="plan_mencionado" style={customInput} endPoint="/api/plan_mencionado" />

                    <label style={labelMargin}>Duración de la Llamada</label>
                    {/* <select style={customInput}><option>Todas</option></select> */}
                    <Select onChange={handleChange} name="duracion_llamada" style={customInput} endPoint="/api/duracion_llamada" />

                    <label style={labelMargin}>Saludo del Asesor</label>
                    {/* <select style={customInput}><option>Todos</option></select> */}
                    <Select onChange={handleChange} name="saludo_asesor" style={customInput} endPoint="/api/saludo_asesor" />

                    <label style={labelMargin}>Nombre del Asesor</label>
                    <Select onChange={handleChange} name="nombre_asesor" style={customInput} endPoint="/api/nombre_asesor" />

                    <label style={labelMargin}>Módulo de Atención</label>
                    <Select onChange={handleChange} name="modulo_atencion" style={customInput} endPoint="/api/modulo_atencion" />

                    <label style={labelMargin}>Clasificación del Sentimiento</label>
                    <Select onChange={handleChange} name="clasificacion_sentimiento" style={customInput} endPoint="/api/clasificacion_sentimiento" />

                    <label style={labelMargin}>Tipo de Llamada</label>
                    <Select onChange={handleChange} name="tipo_llamada" style={customInput} endPoint="/api/tipo_llamada" />

                    <label style={labelMargin}>Asistencia Mencionada</label>
                    <Select onChange={handleChange} name="asistencia_mencionada" style={customInput} endPoint="/api/asistencia_mencionada" />

                    <p style={{ marginBottom: '20px', fontWeight: 'bold', color: '#64748b', fontSize: '12px', letterSpacing: '1px' }}>TRANSCRIPCIONES</p>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: '#1e293b',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}>
                        <input
                            onChange={handleChange}
                            name='transcripcion'
                            type="checkbox"
                            id="transcription-filter"
                            value={true}
                            style={{
                                cursor: 'pointer',
                                width: '18px',
                                height: '18px',
                                accentColor: '#FC3276'
                            }}
                        />
                        <label
                            htmlFor="transcription-filter"
                            style={{ cursor: 'pointer', color: '#cbd5e1', fontSize: '13px' }}
                        >
                            Solo con transcripción
                        </label>
                    </div>
                </div>

                {/* CERRAR SESION */}
                <div style={{ flexShrink: 0, paddingTop: '20px', marginTop: '10px', borderTop: '1px solid #1e293b' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(90deg, #FC3276 0%, #FC3276 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.opacity = '0.9'}
                        onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar;