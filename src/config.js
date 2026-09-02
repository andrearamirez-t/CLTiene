import { auth } from "./firebase";

export const API_BASE = "https://cltiene-backend-293865702055.us-central1.run.app";

// apiFetch: envoltura de fetch que adjunta el ID token de Firebase del usuario
// logueado en el header Authorization, para que el backend (que ahora verifica
// el token) acepte la petición. Mismo contrato que fetch:
//   apiFetch(url, options?) -> Promise<Response>
// Si no hay usuario/token, la petición sale sin Authorization y el backend
// responderá 401 (el frontend ya está detrás del login, así que esto solo pasa
// en el borde de una sesión que expira).
export async function apiFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  try {
    const user = auth.currentUser;
    if (user) headers["Authorization"] = `Bearer ${await user.getIdToken()}`;
  } catch {
    /* sin token: la petición saldrá sin Authorization */
  }
  return fetch(url, { ...options, headers });
}
