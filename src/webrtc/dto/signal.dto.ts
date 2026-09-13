import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SignalDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsObject()
  data: Record<string, any>;
}
