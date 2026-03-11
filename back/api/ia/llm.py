import os
from openai import OpenAI


import dotenv


dotenv.load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

print("API KEY CARGADA:", api_key)

client = OpenAI(api_key=api_key)


def generar_respuesta_ia(prompt: str) -> str:

    try:

        print("PROMPT ENVIADO A IA:")
        print(prompt)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Eres un analista experto en call centers."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        respuesta = response.choices[0].message.content

        print("RESPUESTA IA:", respuesta)

        return respuesta

    except Exception as e:

        print("ERROR COMPLETO IA:")
        print(e)

        return "No fue posible generar el análisis con IA."