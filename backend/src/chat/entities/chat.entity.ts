import { Hobby } from 'src/hobby/entities/hobby.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Hobby, (hobby) => hobby.chat)
  @Index()
  hobby: Hobby;

  @ManyToOne(() => User, (user) => user.chat)
  @Index()
  author: User;
}
