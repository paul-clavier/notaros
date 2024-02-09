import { LoginUseCase } from "@/domain/use-cases/auth/login.use-case";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
    LoginRequest,
    LoginRequestDto,
    LoginResponse,
    LoginResponseDto,
} from "./auth.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    @Post("login")
    @ApiOkResponse({ type: LoginResponseDto })
    async login(@Body() { email, password }: LoginRequestDto) {
        const loginPort = new LoginRequest({ email, password }).toPort();
        const loginResult = await this.loginUseCase
            .execute(loginPort)
            .toPromise();

        // TODO: Create a generic method to extract errors from results + use it here to convert errors to HTTP errors
        return new LoginResponse(loginResult).fromResult();
    }

    @Post("signup")
    async signup(@Body() { email, password }: SignUpRequestDto) {}
}
