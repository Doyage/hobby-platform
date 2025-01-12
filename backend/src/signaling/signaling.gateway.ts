import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/signaling',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class SignalingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger('SignalingGateway');

  afterInit(): void {
    this.logger.log('Signaling Gateway Initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Signaling Gateway Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Signaling Gateway Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} join room: ${roomId}`);

    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} left room: ${roomId}`);

    client.leave(roomId);
  }

  @SubscribeMessage('offer')
  async handleOffer(
    @MessageBody() data: { roomId: string; offer: any },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(`Received offer from ${client.id} in room ${data.roomId}`);

    client.to(data.roomId).emit('offer', {
      offer: data.offer,
    });
  }

  @SubscribeMessage('answer')
  async handleAnswer(
    @MessageBody() data: { roomId: string; answer: any },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    this.logger.log(`Received answer from ${client.id} in room ${data.roomId}`);

    client.to(data.roomId).emit('answer', {
      answer: data.answer,
    });
  }

  @SubscribeMessage('candidate')
  handleCandidate(
    @MessageBody() data: { roomId: string; candidate: any },
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(
      `Received candidate from ${client.id} in room ${data.roomId}`,
    );

    client.to(data.roomId).emit('candidate', {
      candidate: data.candidate,
    });
  }
}
