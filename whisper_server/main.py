import os
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
import whisper
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv


app = FastAPI()

print("Carregando modelo Whisper...")

# Carrega UMA VEZ quando o servidor inicia.
model = whisper.load_model("small")

print("Whisper carregado com sucesso.")


@app.get("/health")
def health():
    return {
        "status": "ok"
    }

class TextsRequest(BaseModel):
    roomId: str
    texts: list[str]

@app.post("/ai")
async def process_ai(request: TextsRequest):
    room_id = request.roomId
    textos = request.texts

    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)

    print("Sala:", room_id)
    print("Textos:", textos)

    prompt = f"""
    Você é um assistente de teleconsultas.

    Analise o texto abaixo e resuma as informações presentes.
    O texto está dividido em blocos de áudio que foram transcritos.
    Caso um bloco não seja legível, apenas o ignore.
    Não adicione NENHUMA informação que não foi dita durante a consulta.
    Dessa forma, não tente gerar diagnósticos, apenas resuma o que foi dito.

    Retorne os tópicos relevantes durante a consulta com a formatação dos tópicos sendo iniciados por ponto de tópico (•)

    Texto:
    {textos}
    """

    resposta = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "text": resposta.output_text,
        "sala": room_id
    }

@app.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...)
):
    temp_path = None

    try:
        # Como o navegador envia WebM/Opus.
        suffix = ".webm"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:
            temp_path = temp_file.name

            content = await file.read()
            temp_file.write(content)
            print("Primeiros bytes:", content[:20])

        print(
            f"Transcrevendo {len(content)} bytes: {temp_path}"
        )

        result = model.transcribe(
            temp_path,
            language="pt",
            fp16=False,
        )

        text = result["text"].strip()

        print("Transcrição:", text)

        return {
            "text": text
        }

    except Exception as error:
        print("Erro ao transcrever:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )

    finally:
        # O áudio é apagado imediatamente.
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/ai")
async def process_ai(request: PromptRequest):
    try:
        texto = request.text.strip()

        if not texto:
            raise HTTPException(
                status_code=400,
                detail="Texto vazio."
            )

        print("\n==============================")
        print("📥 TEXTO RECEBIDO DO NESTJS:")
        print(texto)
        print("==============================\n")

        # Aqui futuramente vamos chamar a IA
        resposta = f"Texto recebido com sucesso: {texto}"

        return {
            "response": resposta
        }

    except Exception as error:
        print("❌ Erro ao processar IA:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )