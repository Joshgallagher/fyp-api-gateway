import { IsString, IsEmail } from 'class-validator';

export class IndexAuthDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;
}
