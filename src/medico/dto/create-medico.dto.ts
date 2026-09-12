import { IsDate, IsString, IsNotEmpty, IsEmail, IsPositive, Length, IsInt } from 'class-validator';

export class CreateMedicoDto {
    @IsNotEmpty()
    @IsString()
    @Length(1,7)
    crm : string;

    @IsNotEmpty()
    @IsString()
    @Length(1,2)
    crm_estado : string;

    @IsNotEmpty()
    @IsString()
    @Length(1,11)
    cpf : string;

    @IsNotEmpty()
    @IsString()
    nome : string;

    @IsNotEmpty()
    @IsString()
    sobrenome : string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsString()
    senha : string;

    @IsNotEmpty()
    @IsString()
    @Length(1,11)
    adm : string;
}
