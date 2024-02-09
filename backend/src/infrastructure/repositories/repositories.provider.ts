import { USER_REPOSITORY } from "@/domain/injection-tokens";
import { UserRepository } from "@/domain/users";
import { Provider } from "@nestjs/common";
import { PrismaUserRepository } from "./repositories";

export const UserRepositoryProvider: Provider<UserRepository> = {
    provide: USER_REPOSITORY,
    useClass: PrismaUserRepository,
};
