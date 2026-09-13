import { IsString, IsNotEmpty, IsInt, IsDateString, IsOptional, Length } from 'class-validator';
import { Timestamp } from 'rxjs';

export class CreateVerificacaoDto {
    @IsString()
    @IsNotEmpty()
    email : string;

    @IsInt()
    @IsNotEmpty()
    codigo : string;

    @IsNotEmpty()
    usado: boolean;

    @IsString()
    @IsNotEmpty()
    data: string;
}
