# ─── Registra la tarea en el Programador de Windows ────────────────────────────
# Ejecutar UNA SOLA VEZ como Administrador.
# La tarea correrá todos los días a las 7:00 AM con tu sesión activa.

$nombre  = "CLTiene_SubirDatos"
$bat     = "$PSScriptRoot\subir_datos.bat"
$hora    = "07:00"

# Eliminar si ya existe
Unregister-ScheduledTask -TaskName $nombre -Confirm:$false -ErrorAction SilentlyContinue

$accion   = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$bat`"" -WorkingDirectory $PSScriptRoot
$disparo  = New-ScheduledTaskTrigger -Daily -At $hora
$config   = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 2) -RunOnlyIfNetworkAvailable
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName $nombre `
    -Action $accion `
    -Trigger $disparo `
    -Settings $config `
    -Principal $principal `
    -Description "Extrae datos de SQL Server CUN y los sube a BigQuery"

Write-Host "Tarea '$nombre' registrada. Correra todos los dias a las $hora." -ForegroundColor Green
Write-Host "Log en: $PSScriptRoot\subir_datos.log" -ForegroundColor Cyan
