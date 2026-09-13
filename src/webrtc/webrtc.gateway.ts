import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { TranscriptionService } from '../transcription/transcription.service.js';

@WebSocketGateway({
  namespace: '/webrtc',
  cors: { origin: '*' },
})
export class WebrtcGateway {

  constructor(
    private readonly transcriptionService: TranscriptionService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly rooms = new Map<string, Set<string>>();

  // Guarda o texto completo de cada sala
  private readonly transcriptionTexts = new Map<string, string>();

  @SubscribeMessage('join_room')
  join(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string; role?: string },
  ) {
    const roomId = String(body?.roomId || '').trim();

    if (!roomId) {
      client.emit('webrtc_error', {
        message: 'roomId é obrigatório.',
      });
      return;
    }

    if (client.data.roomId) {
      this.removeFromRoom(client);
    }

    client.data.roomId = roomId;
    client.data.role = body?.role || 'participant';

    client.join(roomId);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    const room = this.rooms.get(roomId)!;
    room.add(client.id);

    // Inicializa o texto da sala caso ainda não exista
    if (!this.transcriptionTexts.has(roomId)) {
      this.transcriptionTexts.set(roomId, '');
    }

    client.emit('room_joined', {
      roomId,
      participants: room.size,
      isInitiator: room.size === 1,
    });

    client.to(roomId).emit('participant_joined', {
      socketId: client.id,
      role: client.data.role,
    });
  }

  @SubscribeMessage('offer')
  offer(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { offer: RTCSessionDescriptionInit },
  ) {
    const roomId = client.data.roomId;
    if (!roomId || !body?.offer) return;

    client.to(roomId).emit('offer', {
      offer: body.offer,
      from: client.id,
    });
  }

  @SubscribeMessage('audio_chunk')
  async audioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    body: {
      roomId: string;
      sequence: number;
      timestamp: number;
      audio: Buffer;
    },
  ) {

    const roomId = client.data.roomId;

    try {
      const text =
        await this.transcriptionService.transcribeAudio(
          body.audio,
        );

      if (!text) {
        return;
      }

      // Recupera o texto que já foi transcrito nessa sala
      const textoAnterior =
        this.transcriptionTexts.get(roomId) ?? '\n\n';

      // Concatena o novo texto
      const textoCompleto = textoAnterior
        ? `${textoAnterior} ${text}`
        : text;

      // Salva o texto atualizado
      this.transcriptionTexts.set(
        roomId,
        textoCompleto,
      );

      console.log(
        `[TEXTO COMPLETO] sala=${roomId}: ${textoCompleto}`,
      );

    } catch (error) {
      console.error(
        '❌ Erro ao enviar áudio para Whisper:',
        error,
      );
    }
  }

  async processTexts(
    roomId: string,
    texts: string[],
  ): Promise<string[]> {
    const response = await fetch(
      `${"localhost:8000"}/ai`,
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
      texts: string[];
    };

    return result.texts;
  }

  @SubscribeMessage('answer')
  answer(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { answer: RTCSessionDescriptionInit },
  ) {
    const roomId = client.data.roomId;
    if (!roomId || !body?.answer) return;

    client.to(roomId).emit('answer', {
      answer: body.answer,
      from: client.id,
    });
  }

  @SubscribeMessage('ice_candidate')
  iceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { candidate: RTCIceCandidateInit },
  ) {
    const roomId = client.data.roomId;
    if (!roomId || !body?.candidate) return;

    client.to(roomId).emit('ice_candidate', {
      candidate: body.candidate,
      from: client.id,
    });
  }

  @SubscribeMessage('end_call')
  endCall(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    client.to(roomId).emit('call_ended', {
      from: client.id,
    });
  }

  @SubscribeMessage('restart_call')
  restartCall(@ConnectedSocket() client: Socket) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    client.to(roomId).emit('participant_restarted', {
      socketId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    if (!client.data.roomId) return;

    const roomId = client.data.roomId;

    client.to(roomId).emit('participant_left', {
      socketId: client.id,
    });

    this.removeFromRoom(client);
  }

  private removeFromRoom(client: Socket) {
    const roomId = client.data.roomId;
    if (!roomId) return;

    const room = this.rooms.get(roomId);

    if (room) {
      room.delete(client.id);

      if (room.size === 0) {
        this.rooms.delete(roomId);

        // Remove também a transcrição acumulada
        this.transcriptionTexts.delete(roomId);
      }
    }

    client.data.roomId = undefined;
  }
}