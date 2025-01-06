import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveMessageToRedis(roomId: string, message: any): Promise<void> {
    const key = `chat:${roomId}`;
    const msg = JSON.stringify(message);

    await this.cacheManager.set(key, msg, { ttl: 24 * 60 * 60 });
  }

  async flushRedisToDatabase(roomId: string): Promise<void> {
    const key = `chat:${roomId}`;
    const messages = await this.cacheManager.get(key);

    if (messages) {
      const parsedMessages = JSON.parse(messages);
      const chatMessages = parsedMessages.map((msg) =>
        this.chatRepository.create(msg),
      );

      await this.chatRepository.save(chatMessages);
      await this.cacheManager.del(key);
    }
  }
}
