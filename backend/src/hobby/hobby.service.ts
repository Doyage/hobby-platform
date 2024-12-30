import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { Hobby } from './entities/hobby.entity';

@Injectable()
export class HobbyService {
  constructor(
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, createHobbyDto: CreateHobbyDto): Promise<Hobby> {
    const user = await this.userService.findOne(userId);

    const hobby = this.hobbyRepository.create({
      ...createHobbyDto,
      author: user,
    });

    return this.hobbyRepository.save(hobby);
  }

  async findAll(): Promise<Hobby[]> {
    return this.hobbyRepository.find();
  }

  async findOne(id: number): Promise<Hobby> {
    const hobby = await this.hobbyRepository.findOne({ where: { id } });

    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    return hobby;
  }

  async update(id: number, updateHobbyDto: UpdateHobbyDto): Promise<Hobby> {
    const hobby = await this.findOne(id);

    Object.assign(hobby, updateHobbyDto);

    return this.hobbyRepository.save(hobby);
  }

  async remove(id: number): Promise<void> {
    const hobby = await this.findOne(id);

    await this.hobbyRepository.remove(hobby);
  }
}
