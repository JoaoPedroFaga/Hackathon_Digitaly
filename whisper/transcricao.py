import whisper

# Carrega o modelo local do Whisper (modelo 'base' é rápido e leve)
modelo = whisper.load_model("base")

# Realiza a transcrição do arquivo de áudio
resultado = modelo.transcribe("seu_audio.mp3")

# Mostra o texto transcrito na tela
print(resultado["text"])
