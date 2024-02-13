import { User } from "@/domain/users";
import { Mutable } from "@/utils/types";
import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthedRequest, AuthedRequestWithRefreshToken, toPort } from "../dto";
import {
    RefreshTokensResponse,
    SignInRequestDto,
    SignInResponse,
    SignInResponseDto,
    SignUpRequestDto,
    SignUpResponse,
    SignUpResponseDto,
} from "./auth.dto";
import { AccessTokenGuard, RefreshTokenGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signIn")
    @ApiOkResponse({ type: SignInResponseDto })
    login(
        @Body() { email, password }: SignInRequestDto,
    ): Promise<SignInResponseDto> {
        const result = this.authService.signIn(email, password);
        const response = new SignInResponse(result);
        return response.send();
    }

    @Post("signUp")
    @ApiOkResponse({ type: SignUpResponseDto })
    signup(
        @Body() { email, password, firstName, lastName }: SignUpRequestDto,
    ): Promise<SignUpResponseDto> {
        const port = toPort<
            Omit<Mutable<User>, "refreshToken">,
            SignUpRequestDto
        >({
            email,
            password,
            firstName,
            lastName,
        });
        const result = this.authService.signUp(port);
        const response = new SignUpResponse(result);
        return response.send();
    }

    @Get("signOut")
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    async signout(@Request() request: AuthedRequest) {
        await this.authService.signOut(request.user.id);
    }

    @Get("refreshToken")
    @ApiBearerAuth()
    @UseGuards(RefreshTokenGuard)
    refreshTokens(@Request() request: AuthedRequestWithRefreshToken) {
        const result = this.authService.refreshTokens(
            request.user.id,
            request.user.refreshToken,
        );
        const response = new RefreshTokensResponse(result);
        return response.send();
    }
}
