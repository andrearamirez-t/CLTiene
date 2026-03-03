import React, { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');

  const loginConGoogle = async () => {
    const provider = new GoogleAuthProvider();
    
   
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      
      if (email.endsWith('@cltiene.com') || email.endsWith('@cun.edu.co')) {
        console.log("Acceso concedido para:", email);
        setError('');
      } else {
        
        await signOut(auth);
        setError(`El correo ${email} no tiene permisos. Usa una cuenta @cltiene.com`);
      }
    } catch (error) {
      console.error("Error en Login:", error);
      setError("Error al intentar iniciar sesión con Google.");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
        
        <ShieldCheck size={48} color="#be123c" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ marginBottom: '10px', fontSize: '18px', color: '#1e293b' }}>
          Panel de Analytics
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
          Inicia sesión con tu cuenta corporativa
        </p>
        
        <button 
          onClick={loginConGoogle}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px',
            background: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="20" />
          Iniciar sesión con Google
        </button>

        {error && (
          <p style={{ color: '#e11d48', fontSize: '13px', marginTop: '15px', background: '#fff1f2', padding: '10px', borderRadius: '6px' }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: '30px', fontSize: '11px', color: '#94a3b8' }}>
          Desarrollado por <strong>DivergencyAI</strong> | v3.0 PRO
        </p>
      </div>
    </div>
  );
};

export default Login;