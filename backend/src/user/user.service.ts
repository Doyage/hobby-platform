import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const newUser = this.userRepository.create(createUserDto);

    newUser.password = await bcrypt.hash(createUserDto.password, salt);

    try {
      return await this.userRepository.save(newUser);
    } catch (e) {
      if (e instanceof Error && 'code' in e && e.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing User');
      }

      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    await this.userRepository.update(id, updateUserDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
  }
}
