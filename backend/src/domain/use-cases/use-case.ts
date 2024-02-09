import { Task } from "@/utils/monad";

export interface UseCase<Port, Output, Errors> {
    execute(port: Port): Task<Output, Errors>;
}
