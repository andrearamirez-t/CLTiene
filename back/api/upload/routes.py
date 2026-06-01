from fastapi import APIRouter, BackgroundTasks
import threading

router = APIRouter(prefix="/api/upload")

# Estado global simple (una ejecución a la vez)
_estado = {"corriendo": False, "logs": [], "error": None, "filas": None}
_lock = threading.Lock()


def _run(log_fn):
    try:
        from api.upload.procesador import ejecutar_pipeline
        ejecutar_pipeline(log=log_fn)
    except Exception as e:
        with _lock:
            _estado["error"] = str(e)
            _estado["logs"].append(f"ERROR: {e}")
    finally:
        with _lock:
            _estado["corriendo"] = False


@router.post("/iniciar")
def iniciar_upload(background_tasks: BackgroundTasks):
    with _lock:
        if _estado["corriendo"]:
            return {"ok": False, "mensaje": "Ya hay una carga en progreso."}
        _estado["corriendo"] = True
        _estado["logs"] = []
        _estado["error"] = None
        _estado["filas"] = None

    def log_fn(msg):
        with _lock:
            _estado["logs"].append(msg)
        print(msg)

    background_tasks.add_task(_run, log_fn)
    return {"ok": True, "mensaje": "Carga iniciada."}


@router.get("/estado")
def estado_upload():
    with _lock:
        return {
            "corriendo": _estado["corriendo"],
            "logs": list(_estado["logs"]),
            "error": _estado["error"],
            "filas": _estado["filas"],
        }