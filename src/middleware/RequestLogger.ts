import AnsiColour from "@/utils/enums/log-colours";
import Logger from "@/utils/Logger";
import { AsyncLocalStorage } from "node:async_hooks";
import { NextFunction, Request, Response } from "express";

export default class RequestLogger {
    private static store = new AsyncLocalStorage<Logger<"user" | "server">>({ name: "RequestLogger" });

    public static getMiddleware(logName: string, logColour: AnsiColour = AnsiColour.LightCyan) {
        return function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
            const username = req.headers["username"];
            const appVersionRaw = req.headers["app-version"];

            const isUsername = typeof username === "string" && username.length > 0;
            const appVersionNum = typeof appVersionRaw === "string" ? Number(appVersionRaw) : NaN;
            const isAppVersion = Number.isFinite(appVersionNum);

            const logger =
                isUsername && isAppVersion
                    ? new Logger<"user">(logName, logColour, "user", { username, appVersion: appVersionNum })
                    : new Logger<"server">(logName, logColour, "server");

            RequestLogger.store.run(logger, () => next());
        };
    }

    private static getStore() {
        const logger = RequestLogger.store.getStore();
        if (!logger) throw new Error("Logger not found. You forgot to add the middleware or you called this outside of a request.");

        return logger;
    }

    public static debug(message: string) {
        this.getStore().debug(message);
    }

    public static info(message: string) {
        this.getStore().info(message);
    }

    public static warn(message: string) {
        this.getStore().warn(message);
    }

    public static error(message: string) {
        this.getStore().error(message);
    }

    public static critical(message: string) {
        this.getStore().critical(message);
    }
}
