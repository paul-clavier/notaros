import { User, UserRepository } from "@/domain/users";
import { Future } from "@/utils/monad/future";
import { Option } from "@/utils/monad/option";
import { Result } from "@/utils/monad/result";
import { Mutable } from "@/utils/types";
import { User as PrismaUser } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const mapToEntity = (user: PrismaUser): User => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
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
    };
};

const mapFromEntity = (user: User): PrismaUser => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    public findUnique = (
        email: string,
    ): Future<Result<Option<User>, never>> => {
        return Future.Result(email)
            .asyncPipe((email) =>
                this.prisma.user.findUnique({
                    where: {
                        email,
                    },
                }),
            )
            .pipe(Option.fromNull)
            .pipe((user) => user.map(mapToEntity));
    };

    public findById = (id: number) => {
        return this.prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
        });
    };

    public create(user: Mutable<User>): Future<Result<User, never>> {
        return Future.Result(user)
            .pipe(mapFromMutableEntity)
            .asyncPipe((prismaUser) =>
                this.prisma.user.create({ data: prismaUser }),
            )
            .pipe(mapToEntity);
    }
}
