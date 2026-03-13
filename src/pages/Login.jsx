import React, { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ShieldCheck, User, Mail, Lock, ChevronLeft } from "lucide-react";

const Login = () => {
  const [error, setError] = useState("");
  const [modoManual, setModoManual] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [esRegistro, setEsRegistro] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const validacion = {
    longitud: password.length >= 6,
    mayuscula: /[A-Z]/.test(password),
    numero: /[0-9]/.test(password),
    coincide: password === confirmarPassword && confirmarPassword !== "",
  };

  const loginConGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email.endsWith("@cltiene.com") || email.endsWith("@cun.edu.co")) {
        setError("");
      } else {
        await signOut(auth);
        setError(`El correo ${email} no tiene permisos.`);
      }
    } catch (error) {
      console.error("Detalle del error:", error);
      setError("Error al intentar iniciar sesión con Google.");
    }
  };

  const recuperarContrasena = async () => {
    if (!email) {
      setError("Escribe tu correo primero para recuperar la contraseña.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMensajeExito("Te enviamos un correo para restablecer tu contraseña.");
      setError("");
    } catch {
      setError("No encontramos una cuenta con ese correo.");
    }
  };

  const manejarAuthManual = async (e) => {
    e.preventDefault();
    setError("");
    setMensajeExito("");

    if (esRegistro && !Object.values(validacion).every(Boolean)) {
      setError("Corrige los errores de la contraseña antes de continuar.");
      return;
    }

    try {
      if (esRegistro) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: nombre });
        await signOut(auth);
        setMensajeExito("¡Cuenta creada con éxito! Ya puedes ingresar.");
        setEsRegistro(false);
        setNombre("");
        setEmail("");
        setPassword("");
        setConfirmarPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else {
        setError("Error en los datos o contraseña muy corta (mín. 6).");
      }
    }
  };

  const inputStyle = {
    padding: "12px 40px",
    width: "100%",
    marginBottom: "15px",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "white",
    borderRadius: "8px",
    outline: "none",
  };

  const containerInputStyle = { position: "relative", width: "100%" };
  const iconStyle = { position: "absolute", left: "12px", top: "12px", color: "#94a3b8" };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a" }}>
      <div style={{ background: "#1e293b", padding: "40px", borderRadius: "16px", textAlign: "center", width: "100%", maxWidth: "400px", border: "1px solid #334155" }}>
        
        <ShieldCheck size={48} color="#FC3276" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ marginBottom: "10px", fontSize: "22px", color: "white" }}>CL Tiene Analytics</h2>

        {!modoManual ? (
          <>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>Selecciona tu método de acceso</p>
            <button onClick={loginConGoogle} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "12px", background: "white", color: "#0f172a", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginBottom: "15px" }}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="20" />
              Entrar con Google
            </button>
            <button onClick={() => setModoManual(true)} style={{ width: "100%", padding: "12px", background: "transparent", color: "white", border: "1px solid #334155", borderRadius: "8px", cursor: "pointer", fontWeight: "500" }}>
              Entrar con Correo
            </button>
          </>
        ) : (
          <form onSubmit={manejarAuthManual}>
            <div onClick={() => { setModoManual(false); setEsRegistro(false); setError(""); }} style={{ display: "flex", alignItems: "center", color: "#94a3b8", cursor: "pointer", fontSize: "13px", marginBottom: "20px" }}>
              <ChevronLeft size={16} /> Volver
            </div>

            <h3 style={{ color: "white", marginBottom: "20px" }}>{esRegistro ? "Crear Registro" : "Acceso Manual"}</h3>

            {esRegistro && (
              <div style={containerInputStyle}>
                <User size={18} style={iconStyle} />
                <input type="text" placeholder="Nombre Completo" style={inputStyle} required onChange={(e) => setNombre(e.target.value)} />
              </div>
            )}

            <div style={containerInputStyle}>
              <Mail size={18} style={iconStyle} />
              <input type="email" placeholder="Correo electrónico" style={inputStyle} required onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div style={containerInputStyle}>
              <Lock size={18} style={iconStyle} />
              <input type="password" placeholder="Contraseña" style={inputStyle} required onChange={(e) => setPassword(e.target.value)} />
            </div>

            {esRegistro && (
              <>
                <div style={containerInputStyle}>
                  <Lock size={18} style={iconStyle} />
                  <input type="password" placeholder="Confirmar contraseña" style={inputStyle} required onChange={(e) => setConfirmarPassword(e.target.value)} />
                </div>

                {password.length > 0 && (
                  <div style={{ textAlign: "left", marginBottom: "15px", background: "#0f172a", borderRadius: "8px", padding: "10px 14px" }}>
                    {[
                      { ok: validacion.longitud, texto: "Mínimo 6 caracteres" },
                      { ok: validacion.mayuscula, texto: "Al menos una mayúscula" },
                      { ok: validacion.numero,   texto: "Al menos un número" },
                      { ok: validacion.coincide, texto: "Las contraseñas coinciden" },
                    ].map(({ ok, texto }) => (
                      <p key={texto} style={{ margin: "4px 0", fontSize: "12px", color: ok ? "#10b981" : "#94a3b8" }}>
                        {ok ? "✓" : "○"} {texto}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}

            {mensajeExito && (
              <p style={{ color: "#10b981", fontSize: "13px", marginTop: "15px", background: "rgba(16, 185, 129, 0.1)", padding: "10px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                {mensajeExito}
              </p>
            )}

            <button type="submit" style={{ width: "100%", padding: "12px", background: "#FC3276", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
              {esRegistro ? "Registrarse ahora" : "Ingresar"}
            </button>

            {!esRegistro && (
              <p onClick={recuperarContrasena} style={{ color: "#94a3b8", fontSize: "12px", marginTop: "10px", cursor: "pointer", textDecoration: "underline" }}>
                ¿Olvidaste tu contraseña?
              </p>
            )}

            <p onClick={() => { setEsRegistro(!esRegistro); setError(""); }} style={{ color: "#FC3276", fontSize: "13px", marginTop: "10px", cursor: "pointer", textDecoration: "underline" }}>
              {esRegistro ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate aquí"}
            </p>
          </form>
        )}

        {error && (
          <p style={{ color: "#ff4b5c", fontSize: "13px", marginTop: "15px", background: "rgba(255, 75, 92, 0.1)", padding: "10px", borderRadius: "6px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;