import { Injectable } from '@nestjs/common';

@Injectable()
export class TranscriptionService {
  private readonly whisperUrl =
    process.env.WHISPER_URL ?? 'http://localhost:8000';

  async transcribeAudio(audio: Buffer): Promise<string> {
    const formData = new FormData();

    const audioData = new Uint8Array(audio);

    const blob = new Blob([audioData], {
      type: 'audio/webm',
    });

    formData.append('file', blob, 'audio.webm');

    const response = await fetch(
      `${this.whisperUrl}/transcribe`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erro no Whisper: ${response.status} - ${await response.text()}`,
      );
    }

    const result = (await response.json()) as {
      text?: string;
    };

    return result.text?.trim() ?? '' + '\n\n';
  }

  // ENVIA OS TEXTOS PARA A IA E RECEBE OUTROS TEXTOS
  async processTexts(
    roomId: string,
    texts: string[],
  ): Promise<string> {
    const response = await fetch(
      `${this.whisperUrl}/ai`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          texts,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Erro na IA: ${response.status} - ${await response.text()}`,
      );
    }

    const result = (await response.json()) as {
      text: string;
      sala: string;
    };

    console.log('Sala retornada pela IA:', result.sala);
    console.log('Resposta da IA:', result.text);

    return result.text;
  }
}