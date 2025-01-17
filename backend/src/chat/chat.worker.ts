import { Injectable } from '@nestjs/common';
import { Worker } from 'bullmq';
import { ChatService } from './chat.service';

@Injectable()
export class ChatWorker {
  private readonly worker: Worker;

  constructor(private readonly chatService: ChatService) {
    this.worker = new Worker(
      'chat',
      async (job) => {
        const { roomId } = job.data;
        console.log(`Flushing messages for room: ${roomId}`);
        await this.chatService.flushRedisToDatabase(roomId);
      },
      {
        connection: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      },
    );

    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully.`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed: ${err.message}`);
    });
  }
}
