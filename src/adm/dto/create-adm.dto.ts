import { IsDate, IsString, IsNotEmpty, IsEmail, IsPositive, Length, IsInt, isString } from 'class-validator';

export class CreateAdmDto {
    @IsString()
    @Length(1,11)
    @IsNotEmpty()
    cpf : string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsString()
    senha : string;
}
