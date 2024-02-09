import { BYCRYPT_SALT, JWT_SECRET } from "@/app.constants";
import { Task } from "@/utils/monad";
import { Result } from "@/utils/monad/result";
import { Mutable } from "@/utils/types";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { USER_REPOSITORY } from "../injection-tokens";
import { User, UserAlreadyExists, UserNotFoundError } from "../users";
import { UserRepository } from "../users/user.repository";
import { WrongCredentialsError } from "./auth.errors";

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
    ) {}

    signup(user: Mutable<User>): Task<User, UserAlreadyExists> {
        // TODO: Remove this call to DB to catch in repository Prisma P2002 error instead
        return this.validateUserDoesNotExist(user)
            .pipe(this.getUserWithHashedPassword)
            .pipeFuture(this.userRepository.create);
    }

    login(
        email: string,
        password: string,
    ): Task<
        { accessToken: string },
        UserNotFoundError | WrongCredentialsError
    > {
        return this.userRepository
            .findUnique(email)
            .pipeResult((user) =>
                user.toResult(new UserNotFoundError({ email })),
            )
            .pipeResult((user) => this.validateUserPassword(user, password))
            .pipe(this.getUserAccessToken)
            .pipe((accessToken) => ({
                accessToken,
            }));
    }

    private hashPassword(password: string): string {
        return bcrypt.hashSync(password, BYCRYPT_SALT);
    }

    private getUserWithHashedPassword(user: Mutable<User>): Mutable<User> {
        return {
            ...user,
            password: this.hashPassword(user.password),
        };
    }

    private getUserAccessToken(user: User): string {
        return this.jwtService.sign(
            { userId: user.id },
            { secret: JWT_SECRET },
        );
    }

    private validateUserPassword(
        user: User,
        password: string,
    ): Result<User, WrongCredentialsError> {
        const isPasswordValid = bcrypt.compareSync(user.password, password);
        return Result.fromBoolean(isPasswordValid, {
            value: user,
            error: new WrongCredentialsError(),
        });
    }

    private validateUserDoesNotExist(
        user: Mutable<User>,
    ): Task<Mutable<User>, UserAlreadyExists> {
        return this.userRepository
            .findUnique(user.email)
            .pipeResult((persistedUser) =>
                Result.fromBoolean(persistedUser.isNone(), {
                    value: user,
                    error: new UserAlreadyExists(user.email),
                }),
            );
    }
}
