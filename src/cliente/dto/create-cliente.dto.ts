import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    sexo: string;

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
    @IsString()
    @IsNotEmpty()
    nascimento : string;

    @IsString()
    complemento : string;
}
