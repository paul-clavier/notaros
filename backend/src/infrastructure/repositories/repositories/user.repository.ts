import { User, UserNotFoundError, UserRepository } from "@/domain/users";
import { Task } from "@/utils/monad";
import { Future } from "@/utils/monad/future";
import { Option } from "@/utils/monad/option";
import { Result } from "@/utils/monad/result";
import { Mutable } from "@/utils/types";
import { Injectable } from "@nestjs/common";
import { User as PrismaUser } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const mapToEntity = (user: PrismaUser): User => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        refreshToken: Option.fromNull(user.refreshToken),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const mapFromMutableEntity = (user: Mutable<User>): Mutable<PrismaUser> => {
    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        refreshToken: user.refreshToken.toNull(),
    };
};

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) {}

    public findUnique = (
        email: string,
    ): Future<Result<Option<User>, Error>> => {
        return Future.Result(email)
            .pipeAsync((email) =>
                this.prisma.user.findUnique({
                    where: {
                        email,
                    },
                }),
            )
            .pipe(Option.fromNull)
            .pipe((user) => user.map(mapToEntity));
    };

    public findUniqueOrThrow(
        email: string,
    ): Task<User, Error | UserNotFoundError> {
        return this.findUnique(email).pipeResult((userOption) =>
            Result.fromOption(userOption, new UserNotFoundError({ email })),
        );
    }

    public findByIdOrThrow = (
        id: number,
    ): Task<User, Error | UserNotFoundError> => {
        return Future.fromPromise(
            this.prisma.user.findUnique({
                where: {
                    id,
                },
            }),
        )
            .pipe(Option.fromNull)
            .pipe((user) => user.map(mapToEntity))
            .pipeResult((userOption) =>
                Result.fromOption(userOption, new UserNotFoundError({ id })),
            );
    };

    public create(user: Mutable<User>): Future<Result<User, Error>> {
        return Future.Result(user)
            .pipe(mapFromMutableEntity)
            .pipeAsync((prismaUser) =>
                this.prisma.user.create({ data: prismaUser }),
            )
            .pipe(mapToEntity);
    }

    public updateRefreshToken(
        userId: number,
        refreshToken: string | null,
    ): Task<User, Error> {
        return Future.fromPromise<PrismaUser, Error>(
            this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    refreshToken,
                },
            }),
        ).pipe(mapToEntity);
    }
}
