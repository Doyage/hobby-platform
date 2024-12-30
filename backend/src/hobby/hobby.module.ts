import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Hobby } from './entities/hobby.entity';
import { HobbyController } from './hobby.controller';
import { HobbyService } from './hobby.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hobby]), UserModule],
  controllers: [HobbyController],
  providers: [HobbyService],
})
export class HobbyModule {}
