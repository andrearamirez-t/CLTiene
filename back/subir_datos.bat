@echo off
REM ─── Tarea automática: Subir datos CUN → BigQuery ───────────────────────────
REM Programar en Tarea de Windows para que corra sin abrir ventana.

cd /d "%~dp0"

REM Ajusta la ruta de Python si usas un entorno virtual
python subir_datos.py

exit /b %ERRORLEVEL%