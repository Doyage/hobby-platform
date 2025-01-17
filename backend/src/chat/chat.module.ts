import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from 'src/hobby/entities/hobby.entity';
import { User } from 'src/user/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatQueue } from './chat.queue';
import { ChatService } from './chat.service';
import { ChatWorker } from './chat.worker';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Hobby, User])],
  providers: [ChatGateway, ChatService, ChatQueue, ChatWorker],
})
export class ChatModule {}
