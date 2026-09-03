#!/usr/bin/env python
"""Smoke test del backend en PRODUCCIÓN — verifica auth + endpoints clave.

Comprueba que:
  1. Sin token (o token malo) -> 401  (la auth está activa).
  2. /openapi.json -> 404             (docs ocultos en prod).
  3. Con token válido -> 200 en los endpoints de datos.
  4. GET /api/ranking_ia (el que tenía el bug {TABLE}) -> 200 y SIN 'error' en el body.
  5. (--ia) POST /api/analisis_automatico -> 200 sin 'error'  [cuesta 1 llamada a OpenAI].

Cómo obtener el token:
  1. Abre https://cltiene-dashboard.web.app y loguéate.
  2. F12 -> pestaña Network -> clic en cualquier request al backend
     -> Headers -> copia el valor de "authorization"
     (con o sin el prefijo 'Bearer ', el script lo maneja).
  3. Corre:
       FB_TOKEN="<token>" python smoke_test.py          # checks baratos (sin OpenAI)
       FB_TOKEN="<token>" python smoke_test.py --ia      # + endpoint IA (cuesta OpenAI)
     (en PowerShell:  $env:FB_TOKEN="<token>"; python smoke_test.py )
"""
import json
import os
import sys
import urllib.error
import urllib.request

# La consola de Windows (cp1252) revienta con emojis/acentos; forzamos UTF-8.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:  # noqa: BLE001
    pass

BASE = "https://cltiene-backend-293865702055.us-central1.run.app"
TOKEN = os.getenv("FB_TOKEN", "").strip()
if TOKEN.lower().startswith("bearer "):
    TOKEN = TOKEN[7:].strip()
CON_IA = "--ia" in sys.argv


def _call(method, path, token=None, body=None):
    """Devuelve (status_code, body_json_o_None)."""
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    if body is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read()
            code = r.status
    except urllib.error.HTTPError as e:
        return e.code, None
    except Exception as e:  # noqa: BLE001
        return f"ERR({type(e).__name__})", None
    try:
        return code, json.loads(raw)
    except Exception:  # noqa: BLE001
        return code, None


def check(method, path, *, token=None, body=None, expect=200, sin_error=False):
    code, resp = _call(method, path, token=token, body=body)
    ok = code == expect
    detalle = ""
    if ok and sin_error and isinstance(resp, dict) and resp.get("error"):
        ok = False
        detalle = f"  · error en body: {str(resp['error'])[:70]}"
    print(f"  [{'PASS' if ok else 'FALLA'}] {method:4} {path:34} -> {code} (esperado {expect}){detalle}")
    return ok


def main():
    r = []
    print("=== 1. Auth (sin token / token malo / docs ocultos) ===")
    r.append(check("GET", "/api/kpi", token=None, expect=401))
    r.append(check("GET", "/api/kpi", token="malo.malo.malo", expect=401))
    r.append(check("GET", "/openapi.json", token=None, expect=404))

    if not TOKEN:
        print("\n⚠️  Sin FB_TOKEN: solo se probó la parte sin token.")
        print("    Exporta FB_TOKEN (token del navegador) para probar los endpoints con auth.")
        return 0 if all(r) else 1

    print("=== 2. Con token válido — endpoints de datos (GET, sin OpenAI) ===")
    for p in ["/api/kpi", "/api/rendimiento_agente", "/api/distribucion_resultado",
              "/api/embudo_conversacion", "/api/estatus_llamadas", "/limite-fecha"]:
        r.append(check("GET", p, token=TOKEN, expect=200))

    print("=== 3. Endpoint que tenía el bug {TABLE} (GET, sin OpenAI) ===")
    r.append(check("GET", "/api/ranking_ia", token=TOKEN, expect=200, sin_error=True))

    if CON_IA:
        print("=== 4. IA (cuesta OpenAI) ===")
        r.append(check("POST", "/api/analisis_automatico", token=TOKEN, body={}, expect=200, sin_error=True))
    else:
        print("(omitido el POST de IA; corre con --ia para incluirlo — cuesta OpenAI)")

    print(f"\n=== RESULTADO: {sum(r)}/{len(r)} PASS ===")
    return 0 if all(r) else 1


if __name__ == "__main__":
    sys.exit(main())
