import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';

function Sidebar() {
    const customInput = { width: '100%', padding: '8px', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '5px', marginBottom: '10px' }
    const labelMargin = { marginBottom: "1rem" }

    
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Sesión cerrada");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ fontSize: '20px', marginBottom: '30px', display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img style={{ width: "12rem" }} src="src/assets/logo_cl_tiene.png" alt="Logo cl tiene" />
            </div>

            <div style={{ fontSize: '12px', flexGrow: 1, overflowY: 'auto' }}>
                <p style={{ marginBottom: '5px' }}>PERIODO</p>
                <input type="date" defaultValue="2023-11-28" style={customInput} />
                <input type="date" defaultValue="2024-02-23" style={customInput} />
                <hr style={{ border: '0.1px solid #334155', margin: '20px 0' }} />
                
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

            {/* BOTÓN DE CERRAR SESIÓN */}
            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#be123c', 
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