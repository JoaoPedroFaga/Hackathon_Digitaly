import { IsDate, IsString, IsNotEmpty, IsPositive, Length, IsInt } from 'class-validator';

export class CreateConsultaDto {

    @IsNotEmpty()
    @IsInt()
    id : number;

    @IsNotEmpty()
    @IsString()
    @Length(1,11)
    cliente : string;

    @IsNotEmpty()
    @IsString()
    @Length(1,11)
    medico : string;

    @IsNotEmpty()
    @IsDate()
    @Length(1,10)
    data : string;

    @IsNotEmpty()
    @IsString()
    @Length(1,5)
    hora : string;

    @IsNotEmpty()
    @IsString()
    motivo : string;

    @IsString()
    sintomas : string;

    @IsString()
    medicacao : string;

    @IsString()
    piora : string;

    @IsString()
    obs : string;

    @IsString()
    relatorio : string;
}
