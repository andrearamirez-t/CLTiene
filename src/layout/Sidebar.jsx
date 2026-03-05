import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 

function Sidebar() {
    const navigate = useNavigate(); 
    
    const customInput = { 
        width: '100%', 
        padding: '9px', 
        background: '#1e293b', 
        border: '1px solid #334155', 
        color: 'white', 
        borderRadius: '5px', 
        marginBottom: '20px' 
    }
    const labelMargin = { marginBottom: "10px", display: 'block' }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login'); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column'}}>
            <div style={{ fontSize: '20px', marginBottom: '50px', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img style={{ width: "12rem" }} src="src/assets/logo_cl_tiene.png" alt="Logo cl tiene" />
            </div>

            <div style={{ fontSize: '12px', flexGrow: 1, overflowY: 'auto' }}>
                <p style={{ marginBottom: '5px', fontWeight: 'bold', color: '#94a3b8' }}>PERIODO</p>
                <input type="date" defaultValue="2023-11-28" style={customInput} />
                <input type="date" defaultValue="2024-02-23" style={customInput} />
                
                <hr style={{ border: '0.1px solid #334155', margin: '20px 0' }} />
                
                <p style={{ marginBottom: '10px', fontWeight: 'bold', color: '#94a3b8' }}>FILTROS</p>

                
                

                <label style={labelMargin}>Resultado de la Llamada</label><select style={customInput}></select>
                <label style={labelMargin}>Plan Mencionado</label><select style={customInput}></select>
                <label style={labelMargin}>Duración de la Llamada</label><select style={customInput}></select>
                <label style={labelMargin}>Saludo del Asesor</label><select style={customInput}></select>
                <label style={labelMargin}>Nombre del Asesor</label><select style={customInput}></select>
                <label style={labelMargin}>Módulo de Atención</label><select style={customInput}></select>
                <label style={labelMargin}>Clasificación del Sentimiento</label><select style={customInput}></select>
                <label style={labelMargin}>Tipo de Llamada</label><select style={customInput}></select>
                <label style={labelMargin}>Asistencia Mencionada</label><select style={customInput}></select>
            </div>

            <div style={{ marginBottom: '100px' }}>
                    <label style={labelMargin}>Transcripciones</label>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        background: '#1e293b', 
                        padding: '15px', 
                        borderRadius: '5px',
                        border: '1px solid #334155',
                        cursor: 'pointer'
                    }}>
                        <input 
                            type="checkbox" 
                            id="transcription-filter"
                            style={{ 
                                cursor: 'pointer',
                                width: '16px',
                                height: '16px',
                                accentColor: '#FC3276' 
                            }} 
                        />
                        <label 
                            htmlFor="transcription-filter" 
                            style={{ cursor: 'pointer', color: '#cbd5e1', fontSize: '11px' }}
                        >
                            Solo con transcripción
                        </label>
                    </div>
                </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#FC3276', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    )
}

export default Sidebar;