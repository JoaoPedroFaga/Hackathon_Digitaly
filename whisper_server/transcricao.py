import whisper
import pyaudio
import wave
import tempfile
import os
import threading
import queue
import time
import static_ffmpeg
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

static_ffmpeg.add_paths()

# ============================================================
# CONFIGURAÇÕES
# ============================================================

MODELO = "base"

RATE = 16000
CHANNELS = 1
CHUNK = 1024

DURACAO_BLOCO = 5

# Fila de comunicação entre as threads
fila_audio = queue.Queue()

# Sinal para encerrar o programa
executando = True

texto_total = ""


# ============================================================
# WHISPER
# ============================================================

print("Carregando modelo Whisper...")

modelo = whisper.load_model(MODELO)

print("Modelo carregado!")


# ============================================================
# THREAD DO MICROFONE
# ============================================================

def capturar_microfone():

    global executando

    audio = pyaudio.PyAudio()

    stream = audio.open(
        format=pyaudio.paInt16,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK
    )

    # Quantidade de pedaços necessários para formar
    # exatamente DURACAO_BLOCO segundos
    quantidade_chunks = int(
        RATE / CHUNK * DURACAO_BLOCO
    )

    print("🎤 Microfone iniciado.")

    try:

        while executando:

            frames = []

            # ------------------------------------------------
            # O MICROFONE FICA SEMPRE OUVINDO
            # ------------------------------------------------

            for _ in range(quantidade_chunks):

                if not executando:
                    break

                dados = stream.read(
                    CHUNK,
                    exception_on_overflow=False
                )

                frames.append(dados)

            if frames:

                # Coloca o bloco na fila
                fila_audio.put(
                    b"".join(frames)
                )

                print(
                    f"🎤 Bloco capturado | "
                    f"Fila: {fila_audio.qsize()}"
                )

    finally:

        stream.stop_stream()
        stream.close()
        audio.terminate()

        print("🎤 Microfone encerrado.")


# ============================================================
# THREAD DO WHISPER
# ============================================================

def processar_audio():

    global executando

    print("🧠 Thread do Whisper iniciada.")

    while executando or not fila_audio.empty():

        try:

            # Espera aparecer um bloco
            dados_audio = fila_audio.get(
                timeout=0.5
            )

        except queue.Empty:

            continue

        inicio = time.time()

        # ------------------------------------------------
        # CRIA WAV TEMPORÁRIO
        # ------------------------------------------------

        caminho = tempfile.mktemp(
            suffix=".wav"
        )

        audio = pyaudio.PyAudio()

        with wave.open(caminho, "wb") as arquivo:

            arquivo.setnchannels(CHANNELS)

            arquivo.setsampwidth(
                audio.get_sample_size(
                    pyaudio.paInt16
                )
            )

            arquivo.setframerate(RATE)

            arquivo.writeframes(
                dados_audio
            )

        audio.terminate()

        # ------------------------------------------------
        # WHISPER
        # ------------------------------------------------

        resultado = modelo.transcribe(
            caminho,
            language="pt",
            fp16=False,
            verbose=False
        )

        texto = resultado["text"].strip()

        tempo = time.time() - inicio

        # ------------------------------------------------
        # RESULTADO
        # ------------------------------------------------

        if texto:

            global texto_total
            texto_total += " " + texto

            print(
                f"\n🗣️ {texto}"
            )

            print(
                f"   Processado em {tempo:.2f}s"
            )

        # ------------------------------------------------
        # REMOVE WAV
        # ------------------------------------------------

        if os.path.exists(caminho):
            os.remove(caminho)

        fila_audio.task_done()


# ============================================================
# CRIA AS THREADS
# ============================================================

thread_microfone = threading.Thread(
    target=capturar_microfone,
    daemon=True
)

thread_whisper = threading.Thread(
    target=processar_audio,
    daemon=True
)


# ============================================================
# INICIA
# ============================================================

thread_microfone.start()
thread_whisper.start()


print("\n========================================")
print("      TRANSCRIÇÃO EM TEMPO REAL")
print("========================================")
print("Fale normalmente.")
print("Pressione CTRL+C para parar.\n")

# ============================================================
# ENVIA O TEXTO PARA A API DO GPT
# ============================================================

def enviar_para_gpt(texto):

    prompt = f"""
    Você é um assistente de teleconsultas.

    Analise o texto abaixo e resuma as informações presentes, tentando traduzir qualquer erro de transcrição do audio.
    Não adicione NENHUMA informação que não foi dita durante a consulta.
    Dessa forma, não tente gerar diagnósticos, apenas resuma o que foi dito.

    Retorne os tópicos relevantes durante a consulta com a formatação dos tópicos sendo iniciados por ponto de tópico (•)

    Texto:
    {texto}
    """

    resposta = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return resposta.output_text

# ============================================================
# MANTÉM O PROGRAMA RODANDO
# ============================================================

try:

    while True:
        time.sleep(0.1)

except KeyboardInterrupt:

    print("\n\nEncerrando...")

    executando = False

    print(enviar_para_gpt(texto_total))

    # Espera as threads terminarem
    thread_microfone.join()
    thread_whisper.join()

    print("Programa encerrado.")
