import { AuthService } from "@/domain/services";
import { User } from "@/domain/users";
import { Mutable } from "@/utils/types";
import { UseCase } from "../use-case";

export type SignUpPort = Mutable<User>;

export type SignUpResult = Future<Result<User>>;

export class SignUpUseCase implements UseCase<SignUpPort, SignUpResult> {
    constructor(private authService: AuthService) {}

    execute(port: SignUpPort): Promise<SignUpResult> {
        return this.authService.signup(port);
    }
}
