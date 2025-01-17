import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import 'dotenv/config';

@Injectable()
export class ChatQueue {
  public readonly queue: Queue;

  constructor() {
    this.queue = new Queue('chat', {
      connection: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    });
  }
  async addFlushTask(roomId: string): Promise<void> {
    await this.queue.add(
      'flush',
      { roomId },
      { attempts: 3, backoff: 5000, removeOnComplete: true },
    );
  }
}
