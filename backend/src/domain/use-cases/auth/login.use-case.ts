import { AuthService } from "@/domain/services";
import { WrongCredentialsError } from "@/domain/services/auth.errors";
import { UserNotFoundError } from "@/domain/users";
import { UseCase } from "../use-case";

export interface LoginPort {
    email: string;
    password: string;
}

export interface LoginResult {
    accessToken: string;
}

type LoginErrors = WrongCredentialsError | UserNotFoundError;

export class LoginUseCase
    implements UseCase<LoginPort, LoginResult, LoginErrors>
{
    constructor(private authService: AuthService) {}

    execute(port: LoginPort) {
        return this.authService.login(port.email, port.password);
    }
}
