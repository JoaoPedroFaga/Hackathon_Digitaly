import { IsDate, IsString, IsNotEmpty, IsEmail, IsPositive, Length, IsInt } from 'class-validator';

export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    @Length(1,11)
    cpf : string;

    @IsString()
    @IsNotEmpty()
    nome : string;

    @IsString()
    @IsNotEmpty()
    sobrenome : string;

    @IsString()
    @IsNotEmpty()
    @Length(1,11)
    tel : string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    sexo: number;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    senha: string;

    @IsString()
    @IsNotEmpty()
    estado: string;
    
    @IsString()
    @IsNotEmpty()
    cidade: string;
       
    @IsString()
    @IsNotEmpty()
    rua: string;

    @IsString()
    @IsNotEmpty()
    numero: string;

    @Length(1,10)
    @IsDate()
    @IsNotEmpty()
    nascimento : string;
}
