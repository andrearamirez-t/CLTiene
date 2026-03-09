def filters(filters: dict) -> dict:
    filtros_object = {}
    filtros_string = []

    for key, value in filters.items():

        # Ignorar None
        if value is None:
            continue

        # Ignorar string vacío
        if isinstance(value, str) and value.strip() == "":
            continue

        # Ignorar listas vacías
        if isinstance(value, list) and len(value) == 0:
            continue

        # Ignorar diccionarios vacíos
        if isinstance(value, dict) and len(value) == 0:
            continue

        filtros_object[key] = value

        if key == "fecha_desde":
            filtros_string.append(f"fecha >= {value}")

        if key == "fecha_hasta":
            filtros_string.append(f"fecha <= {value}")

        if key in ["resultado_llamada", "plan_mencionado", "Duracion_Estimada"]:
            filtros_string.append(f"{key} = '{value}'")

        if key == "duracion_llamada":
            filtros_string.append(f"Duracion_Estimada = '{value}'")

        # Pendiente: ya tengo el calculo, pero se complejo sacarlo a una consulta
        # if key == "saludo_asesor":
        #     filtros_string.append("")

        if key == "nombre_asesor":
            filtros_string.append(f"cuenta like '%{value}%'")

        if key == "modulo_atencion":
            filtros_string.append(f"nombre_atencion = {value}")

        # No es viable obtener el dato mejor con IA
        # if key == "clasificacion_sentimiento":
        #     print(key)

        if key == "tipo_llamada":
            filtros_string.append(f"tipo = {value}")

        if key == "transcripcion" and value:
            filtros_string.append("transcripcion is not null")

    result = {
        "filter_string": " AND ".join(filtros_string) if filtros_string else "1=1",
        "filter_array": filtros_object,
    }

    print(result)

    return result
