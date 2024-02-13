import { logger } from "@/utils/logger";
import { Task } from "@/utils/monad";

export abstract class UseCase<
    Port,
    Output,
    Errors extends { message: string },
> {
    constructor(port: Port) {
        logger.log("Domain", `${UseCase.name} In`, JSON.stringify(port));
    }
    abstract pipeline: () => Task<Output, Errors | Error>;

    execute = (): Task<Output, Errors | Error> => {
        return this.pipeline()
            .pipeTap((value: Output) =>
                logger.log(
                    "Domain",
                    `${UseCase.name} Out`,
                    JSON.stringify(value),
                ),
            )
            .pipeTapError((error: Errors | Error) =>
                logger.error("Domain", `${UseCase.name} Out`, error.message),
            );
    };
}
