import {
    BYCRYPT_SALT,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
} from "@/app.constants";
import { USER_REPOSITORY } from "@/domain/injection-tokens";
import {
    User,
    UserAlreadyExists,
    UserNotFoundError,
    UserRepository,
} from "@/domain/users";
import { Future, None, Result, Task } from "@/utils/monad";
import { Mutable } from "@/utils/types";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WrongPasswordError, WrongRefreshTokenError } from "./auth.errors";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcrypt");

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

// TODO: Find a way to properly put this service into the domain and create 3 use-cases for auth
@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY) private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    signUp = (
        user: Omit<Mutable<User>, "refreshToken">,
    ): Task<Tokens, UserAlreadyExists | Error> => {
        return this.validateUserDoesNotExist(user.email)
            .pipe(() => bcrypt.hashSync(user.password, BYCRYPT_SALT))
            .pipeTask((hashedPassword) =>
                this.userRepository.create({
                    ...user,
                    password: hashedPassword,
                    refreshToken: None(),
                }),
            )
            .pipeTask((user) => this.createAndUpdateTokens(user));
    };

    signIn = (
        email: string,
        password: string,
    ): Task<Tokens, Error | WrongPasswordError | UserNotFoundError> => {
        return this.userRepository
            .findUniqueOrThrow(email)
            .pipeTap((user) => this.validatePassword(user, password))
            .pipeTask((user) => this.createAndUpdateTokens(user));
    };

    signOut = (userId: number): Task<User, Error> => {
        return this.userRepository.updateRefreshToken(userId, null);
    };

    refreshTokens = (
        userId: number,
        refreshToken: string,
    ): Task<Tokens, UserNotFoundError | WrongRefreshTokenError | Error> => {
        return this.userRepository
            .findByIdOrThrow(userId)
            .pipeTask((user) => this.validateRefreshToken(user, refreshToken))
            .pipeTask((user) => this.createAndUpdateTokens(user));
    };

    private validateUserDoesNotExist = (
        email: string,
    ): Task<string, UserAlreadyExists | Error> => {
        console.log({ email });
        return this.userRepository.findUnique(email).pipeResult((user) => {
            console.log({
                user,
                neg: !user,
                result: Result.fromBoolean(!user, {
                    value: email,
                    error: new UserAlreadyExists(email),
                }),
            });
            return Result.fromBoolean(user.isNone(), {
                value: email,
                error: new UserAlreadyExists(email),
            });
        });
    };

    private validatePassword = (
        user: User,
        password: string,
    ): Task<User, WrongPasswordError> => {
        const passwordMatches = bcrypt.compareSync(password, user.password);
        return Future.value(
            Result.fromBoolean(passwordMatches, {
                value: user,
                error: new WrongPasswordError(user.email),
            }),
        );
    };

    private validateRefreshToken = (
        user: User,
        refreshToken: string,
    ): Task<User, Error | WrongRefreshTokenError> => {
        return Future.Result(user.refreshToken.getWithDefault(""))
            .pipe((userRefreshToken) =>
                bcrypt.compareSync(refreshToken, userRefreshToken),
            )
            .pipeResult((isTokenValid: boolean) =>
                Result.fromBoolean(isTokenValid, {
                    value: user,
                    error: new WrongRefreshTokenError(user.id),
                }),
            );
    };

    private createAndUpdateTokens = (user: User): Task<Tokens, Error> => {
        return Future.Result(this.getTokens(user)).pipeTap((tokens) => {
            const hashedRefreshToken = bcrypt.hashSync(
                tokens.refreshToken,
                BYCRYPT_SALT,
            ) as string;
            this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);
        });
    };

    private getTokens = (user: User): Tokens => {
        const userPayload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const accessToken = this.jwtService.sign(userPayload, {
            secret: JWT_ACCESS_SECRET,
            expiresIn: "60s",
        });
        const refreshToken = this.jwtService.sign(userPayload, {
            secret: JWT_REFRESH_SECRET,
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };
    };
}
