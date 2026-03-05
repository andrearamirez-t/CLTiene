import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { ShieldCheck, UserPlus, LogIn, ChevronLeft } from 'lucide-react';

const Login = () => {

  const [error, setError] = useState('');
  const [modoManual, setModoManual] = useState(false);
  const [esRegistro, setEsRegistro] = useState(false);

  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');

  // ---------------- GOOGLE LOGIN ----------------
  const loginConGoogle = async () => {

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {

      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (email.endsWith('@cltiene.com') || email.endsWith('@cun.edu.co')) {
        setError('');
      } else {
        await signOut(auth);
        setError(`Acceso denegado para ${email}`);
      }

    } catch (err) {
      console.log(err);
      setError("Error al conectar con Google.");
    }

  };


  // ---------------- LOGIN / REGISTRO POR CEDULA ----------------
  const manejarAuthCedula = async (e) => {

    e.preventDefault();
    setError('');

    const emailFalso = `${cedula}@cltiene.com`;
    const pass = password;

    try {

      // REGISTRO
      if (esRegistro) {

        const res = await createUserWithEmailAndPassword(
          auth,
          emailFalso,
          pass
        );

        await updateProfile(res.user, {
          displayName: nombre
        });

      }

      // LOGIN
      else {

        await signInWithEmailAndPassword(
          auth,
          emailFalso,
          pass
        );

      }

    } catch (err) {

      console.log("Firebase error:", err.code);

      if (err.code === "auth/email-already-in-use") {
        setError("Esta cédula ya está registrada.");
      }
      else if (err.code === "auth/user-not-found") {
        setError("Esta cédula no está registrada.");
      }
      else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta.");
      }
      else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener mínimo 6 caracteres.");
      }
      else {
        setError("Error al procesar la solicitud.");
      }

    }

  };


  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    background: '#0f172a',
    border: '1px solid #334155',
    color: 'white',
    borderRadius: '8px',
    outline: 'none'
  };

  const btnRosa = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #FC3276 0%, #be123c 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };


  return (

    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>

      <div style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        textAlign: 'center',
        width: '90%',
        maxWidth: '400px',
        border: '1px solid #334155'
      }}>


        <div style={{ marginBottom: '30px' }}>
          <img src="src/assets/logo_cl_tiene.png" alt="Logo" style={{ width: '160px', marginBottom: '10px' }} />
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>v3.0 PRO Analytics</p>
        </div>


        {!modoManual ? (

          <>
            <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '25px' }}>
              Iniciar Sesión
            </h2>

            <button
              onClick={loginConGoogle}
              style={{ ...btnRosa, background: 'white', color: '#1e293b', marginBottom: '15px' }}
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="G"
                width="20"
              />
              Continuar con Google
            </button>

            <button
              onClick={() => setModoManual(true)}
              style={{ ...btnRosa, background: 'transparent', border: '1px solid #334155' }}
            >
              <ShieldCheck size={18} />
              Entrar con Correo
            </button>

          </>

        ) : (

          <form onSubmit={manejarAuthCedula}>

            <div
              style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', cursor: 'pointer', color: '#94a3b8' }}
              onClick={() => setModoManual(false)}
            >
              <ChevronLeft size={16} />
              <span style={{ fontSize: '12px' }}>Volver</span>
            </div>


            <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}>
              {esRegistro ? 'Registro Nuevo' : 'Acceso por Correo'}
            </h2>


            {esRegistro && (
              <input
                type="text"
                placeholder="Nombre Completo"
                style={inputStyle}
                required
                onChange={(e) => setNombre(e.target.value)}
              />
            )}


            <input
              type="text"
              inputMode="numeric"
              placeholder="Número de Cédula"
              style={inputStyle}
              required
              onChange={(e) => setCedula(e.target.value)}
            />


            <input
              type="password"
              placeholder="Contraseña"
              style={inputStyle}
              required
              onChange={(e) => setPassword(e.target.value)}
            />


            <button type="submit" style={btnRosa}>
              {esRegistro ? <UserPlus size={18} /> : <LogIn size={18} />}
              {esRegistro ? 'Crear mi cuenta' : 'Ingresar'}
            </button>


            <p
              onClick={() => setEsRegistro(!esRegistro)}
              style={{
                color: '#FC3276',
                fontSize: '12px',
                marginTop: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {esRegistro
                ? '¿Ya tienes cuenta? Entra aquí'
                : '¿No tienes cuenta? Regístrate aquí'}
            </p>

          </form>

        )}


        {error && (
          <p style={{
            color: '#ff4b5c',
            fontSize: '12px',
            marginTop: '15px',
            background: 'rgba(255,75,92,0.1)',
            padding: '10px',
            borderRadius: '8px'
          }}>
            {error}
          </p>
        )}


        <p style={{
          marginTop: '30px',
          fontSize: '10px',
          color: '#475569',
          letterSpacing: '1px'
        }}>
          POWERED BY DIVERGENCYAI
        </p>

      </div>

    </div>
  );

};

export default Login;