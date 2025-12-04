import AnsiColour from "@/utils/enums/log-colours";
import Logger from "@/utils/Logger";
import { Application, NextFunction, Request, Response } from "express";

const apiLogger = new Logger("API", AnsiColour.LightMagenta, "api");

export interface RequestWithBodyContent extends Request {
    bodyContent?: string;
}

export interface ResponseWithBodyContent extends Response {
    bodyContent?: string;
}

const captureRequestBody = (req: RequestWithBodyContent, _res: Response, next: NextFunction) => {
    req.bodyContent = req.body ?? "";
    next();
};

const captureResponseBody = (_req: Request, res: ResponseWithBodyContent, next: NextFunction) => {
    const oldSend = res.send.bind(res);

    res.send = function (body: unknown) {
        const responseBody = typeof body === "string" ? body : JSON.stringify(body);
        res.bodyContent = responseBody ?? "";
        return oldSend(body);
    };

    next();
};

export default function setupLoggerMiddleware(app: Application) {
    app.use(captureRequestBody);
    app.use(captureResponseBody);
    app.use(loggerMiddleware);
}

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    res.on("finish", () => {
        apiLogger.info({
            request: req,
            response: res,
            latency: Date.now() - startTime,
        });
    });

    next();
}
