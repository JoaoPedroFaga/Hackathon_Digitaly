import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/webrtc',
  cors: { origin: '*' },
})
export class WebrtcGateway {
  @WebSocketServer()
  server: Server;

  private readonly rooms = new Map<string, Set<string>>();

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
      }
    }

    client.data.roomId = undefined;
  }
}
