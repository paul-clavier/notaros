import {
    LoginPort,
    LoginResult,
    SignUpPort,
    SignUpResult,
} from "@/domain/use-cases";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { RequestDto, ResponseDto } from "../dto";

export class LoginRequestDto implements LoginPort {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password: string;
}

export class LoginRequest implements RequestDto<LoginPort, LoginRequestDto> {
    data: LoginRequestDto;
    constructor(data: LoginRequestDto) {
        this.data = data;
    }

    toPort(): LoginPort {
        return {
            email: this.data.email,
            password: this.data.password,
        };
    }
}

export class LoginResponseDto implements LoginResult {
    @ApiProperty()
    accessToken: string;
}

export class LoginResponse
    implements ResponseDto<LoginResult, LoginResponseDto>
{
    data: LoginResult;
    constructor(data: LoginResult) {
        this.data = data;
    }

    fromResult(): LoginResponseDto {
        return {
            accessToken: this.data.accessToken,
        };
    }
}

// SIGNUP
export class SignUpRequestDto implements SignUpPort {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password: string;
}

export class SignUpRequest implements RequestDto<LoginPort, LoginRequestDto> {
    data: LoginRequestDto;
    constructor(data: LoginRequestDto) {
        this.data = data;
    }

    toPort(): LoginPort {
        return {
            email: this.data.email,
            password: this.data.password,
        };
    }
}

export class SignUpResponseDto implements SignUpResult {
    @ApiProperty()
    accessToken: string;
}

export class SignUpResponse
    implements ResponseDto<SignUpResult, SignUpResponseDto>
{
    data: LoginResult;
    constructor(data: LoginResult) {
        this.data = data;
    }

    fromResult(): LoginResponseDto {
        return {
            accessToken: this.data.accessToken,
        };
    }
}
