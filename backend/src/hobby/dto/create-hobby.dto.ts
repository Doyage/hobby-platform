import { IsString } from 'class-validator';

export class CreateHobbyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
