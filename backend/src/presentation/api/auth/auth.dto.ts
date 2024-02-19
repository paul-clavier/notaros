import { UserAlreadyExists, UserNotFoundError } from "@/domain/users";
import { parseJwt } from "@/utils/encoding";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ResponseDto } from "../dto";
import { WrongPasswordError, WrongRefreshTokenError } from "./auth.errors";
import { Tokens } from "./auth.service";
import { UserPayload } from "./jwt.strategy";

export class SignInRequestDto {
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

export class SignInResponseDto implements UserPayload {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}

export class SignInResponse extends ResponseDto<
    Tokens,
    WrongPasswordError | UserNotFoundError,
    SignInResponseDto
> {
    fromResult = (data: Tokens): SignInResponseDto => {
        return parseJwt<UserPayload>(data.accessToken);
    };
    fromError = (): HttpException => {
        return new HttpException(
            "Either the email or the password are incorrect",
            HttpStatus.BAD_REQUEST,
        );
    };
}

export class SignUpRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;
}

export class SignUpResponseDto implements UserPayload {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}

export class SignUpResponse extends ResponseDto<
    Tokens,
    UserAlreadyExists,
    SignUpResponseDto
> {
    fromResult = (data: Tokens): SignUpResponseDto => {
        return parseJwt<UserPayload>(data.accessToken);
    };
    fromError = (error: UserAlreadyExists): HttpException => {
        return new HttpException(
            `You cannot register with email: ${error.email}`,
            HttpStatus.BAD_REQUEST,
        );
    };
}

export class RefreshTokensResponseDto {}

export class RefreshTokensResponse extends ResponseDto<
    Tokens,
    UserNotFoundError | WrongRefreshTokenError,
    RefreshTokensResponseDto
> {
    fromResult = (): RefreshTokensResponseDto => {
        return {};
    };

    fromError = (): HttpException => {
        return new HttpException(
            "Though your auth token is valid, we could not find your account. Please contact our team",
            HttpStatus.BAD_REQUEST,
        );
    };
}
