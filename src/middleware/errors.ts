import { HttpStatusCodes } from "@/enums/http";
import AnsiColour from "@/enums/log-colours";
import HttpException from "@/exceptions/HttpException";
import Logger from "@/utils/Logger";
import { Request, Response, NextFunction } from "express";

const sysLogger = new Logger("ErrorHandler", AnsiColour.LightCyan, "server");

export default async function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof HttpException) {
        res.status(err.statusCode).json(err);
        return;
    }

    sysLogger.error(err.message);
    res.status(HttpStatusCodes.ServerError.INTERNAL_SERVER_ERROR).json({
        message: err instanceof Error ? err.message : "Internal Server Error",
    });
}
