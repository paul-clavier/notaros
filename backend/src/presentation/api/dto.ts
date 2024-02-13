import { logger } from "@/utils/logger";
import { Task } from "@/utils/monad";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserPayload } from "./auth/jwt.strategy";

export type AuthedRequest = { user: UserPayload };
export type AuthedRequestWithRefreshToken = {
    user: UserPayload & { refreshToken: string };
};

/**
 * This method can be used to convert Dtos to Port objects in the case where Dto type extends Port.
 * If this is not the case, you should implement your own toPort method
 */
export const toPort = <Port, DTO extends Port>(data: DTO): Port => {
    return data as Port;
};

const isError = (error: any): error is Error => {
    return error instanceof Error && error.name === "Error";
};

export abstract class ResponseDto<A, E extends { message: string }, DTO> {
    task: Task<A, E | Error>;

    constructor(task: Task<A, E | Error>) {
        this.task = task;
    }

    abstract fromResult: (data: A) => DTO;
    abstract fromError: (error: E) => HttpException;

    send = (): Promise<DTO> => {
        return this.task
            .resultToPromise()
            .then(this.fromResult)
            .catch((error: E | Error) => {
                if (isError(error)) {
                    logger.error(
                        "Presentation",
                        "Response",
                        `An internal error has occured: ${error}`,
                    );
                    throw new HttpException(
                        "The server has encountered an internal error",
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
                throw this.fromError(error);
            });
    };
}
