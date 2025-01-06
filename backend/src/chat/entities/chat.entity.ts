import { Hobby } from 'src/hobby/entities/hobby.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  hobby: Hobby;

  @ManyToOne(() => User, (user) => user.chat)
  author: User;
}
