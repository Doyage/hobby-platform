import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Hobby } from 'src/hobby/entities/hobby.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private isFiveMinutesPassed(
    lastTimestamp: number,
    currentTimestamp: number,
  ): boolean {
    const elapsed = currentTimestamp - lastTimestamp;
    return elapsed >= 5 * 60 * 1000;
  }

  async saveMessageToRedis(roomId: string, message: any): Promise<void> {
    const key = `chat:${roomId}`;
    const timestamp = Date.now();
    const msg = { message, timestamp };

    let cachedMessages = await this.cacheManager.get(key);

    if (cachedMessages) {
      cachedMessages = JSON.parse(cachedMessages);

      cachedMessages.push(msg);
    } else {
      cachedMessages = [msg];
    }

    await this.cacheManager.set(key, JSON.stringify(cachedMessages), {
      ttl: 24 * 60 * 60,
    });

    if (
      cachedMessages.length >= 5 ||
      this.isFiveMinutesPassed(cachedMessages[0]?.timestamp, timestamp)
    ) {
      await this.flushRedisToDatabase(roomId);
      cachedMessages = [];
    }
  }

  async flushRedisToDatabase(roomId: string): Promise<void> {
    const key = `chat:${roomId}`;
    const messages = await this.cacheManager.get(key);

    if (messages) {
      const parsedMessages = JSON.parse(messages);

      const chatMessages = await Promise.all(
        parsedMessages.map(async (msg) => {
          const { message } = msg;
          const hobby = await this.hobbyRepository.findOne({
            where: { id: +roomId },
          });
          const author = await this.userRepository.findOne({
            where: { id: message.userId },
          });

          if (!hobby || !author) {
            throw new Error('Invalid roomId or userId');
          }

          return this.chatRepository.create({
            hobby,
            author,
            message: message.message,
            createdAt: new Date(message.createdAt),
          });
        }),
      );

      await this.chatRepository.save(chatMessages);

      await this.cacheManager.del(key);
    }
  }
}
