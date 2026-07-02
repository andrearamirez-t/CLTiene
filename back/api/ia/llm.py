from IA.Open_AI import call


def generar_respuesta_ia(prompt: str) -> str:
    # Usa call() para heredar el balanceo y failover entre las 2 keys.
    contenido, error = call(
        "Eres un analista experto en call centers.",
        prompt,
        temperature=0.3,
    )
    if error:
        print("ERROR IA:", error)
        return "No fue posible generar el análisis con IA."
    return contenido