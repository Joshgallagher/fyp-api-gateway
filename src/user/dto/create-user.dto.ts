import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    readonly name: number;

    @IsEmail()
    readonly email: number;

    @IsString()
    readonly password: number;
}
