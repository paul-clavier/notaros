import { pipe } from "./monad/pipe";

type Layer = "Presentation" | "Domain" | "Infrastructure" | "Test";

interface ModuleLogger {
    log: (layer: Layer, module: string, message: string) => void;
    error: (layer: Layer, module: string, message: string) => void;
}

interface MonadLogger {
    log: (monad: string, message: unknown) => void;
    error: (monad: string, message: unknown) => void;
}

const baseLog = (message: string, level = "info") => {
    const loggingMethod = level === "info" ? console.log : console.error;
    loggingMethod(message);
};

class ModuleLoggerProvider implements ModuleLogger {
    public log = (layer: Layer, module: string, message: string) =>
        pipe([layer, module, message])
            .map(this.buildMessage)
            .map((message) => baseLog(message));

    public error = (layer: Layer, module: string, message: string) =>
        pipe([layer, module, message])
            .map(this.buildMessage)
            .map((message) => baseLog(message, "error"));

    private buildMessage = (layer: Layer, module: string, message: string) => {
        return `[${layer}][${module}]: ${message}`;
    };
}

class MonadLoggerProvider implements MonadLogger {
    public log = (monad: string, message: unknown) =>
        pipe([monad, message])
            .map(this.buildMessage)
            .map((message) => baseLog(message));

    public error = (monad: string, message: unknown) =>
        pipe([monad, message])
            .map(this.buildMessage)
            .map((message) => baseLog(message, "error"));

    private buildMessage = (monad: string, message: unknown) => {
        return `[${monad}]: ${message}`;
    };
}

export const logger = new ModuleLoggerProvider();
export const monadLogger = new MonadLoggerProvider();
