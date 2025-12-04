import Environment from "@/config/Environment";
import AnsiColour, { AnsiReset } from "./enums/log-colours";
import { SuccessStatus, RedirectionStatus, ClientErrorStatus, ServerErrorStatus } from "./enums/http";
import { Request, Response } from "express";
import { RequestWithBodyContent, ResponseWithBodyContent } from "@/middleware/logger";
import { getIp } from "./ip";

type LogSeverity = "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL";
type LogMode = "server" | "user" | "api";

type LogLabels<M extends LogMode> = M extends "user" ? { username: string; appVersion: number } : undefined;

type LogOptions<M extends LogMode> = M extends "api" ? { request: Request; response: Response; latency: number } : undefined;

type HttpRequest = {
    requestMethod: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    requestUrl: string;
    requestSize: string;
    status: SuccessStatus | RedirectionStatus | ClientErrorStatus | ServerErrorStatus;
    responseSize: string;
    userAgent: string;
    remoteIp: string;
    serverIp: string;
    referer: string;
    latency: string;
};

const coloursForSeverity: Record<LogSeverity, AnsiColour> = {
    DEBUG: AnsiColour.DarkGray,
    INFO: AnsiColour.Green,
    WARN: AnsiColour.Yellow,
    ERROR: AnsiColour.LightRed,
    CRITICAL: AnsiColour.Red,
};

export default class Logger<T extends LogMode> {
    private static get isProduction() {
        try {
            return Environment.getEnv("NODE_ENV") === "production";
        } catch {
            return false;
        }
    }
    private loggerName: string;
    private loggerColour: AnsiColour;
    private logMode: T;
    private labels?: LogLabels<T>;

    constructor(loggerName: string, loggerColour: AnsiColour, mode: T, labels?: LogLabels<T>) {
        this.loggerName = loggerName;
        this.loggerColour = loggerColour;
        this.logMode = mode;
        this.labels = labels;
    }

    private formatLog(severity: LogSeverity, message: T extends "api" ? LogOptions<T> : string): string {
        const timestamp = new Date().toISOString();

        if (Logger.isProduction) {
            if (this.logMode !== "api") {
                return JSON.stringify({
                    severity,
                    time: timestamp,
                    message,
                    labels: this.labels!,
                });
            }

            const { request, response, latency } = message as LogOptions<"api">;
            const ip = getIp(request);
            const httpRequest: HttpRequest = {
                requestMethod: request.method as HttpRequest["requestMethod"],
                requestUrl: request.originalUrl || request.url,
                requestSize: request.socket.bytesRead.toString(),
                status: response.statusCode as HttpRequest["status"],
                responseSize: (response.get("content-length") || "0").toString(),
                userAgent: request.get("user-agent") || "",
                remoteIp: ip,
                serverIp: request.socket.localAddress || "",
                referer: request.get("referer") || "",
                latency: `${(latency / 1000).toFixed(3)}s`,
            };

            const requestBody = (request as RequestWithBodyContent).bodyContent;
            const responseBody = (response as ResponseWithBodyContent).bodyContent;

            return JSON.stringify({
                severity,
                time: timestamp,
                labels: {
                    requestBody,
                    responseBody,
                },
                httpRequest,
            });
        }

        const severityColour = coloursForSeverity[severity];
        const logPrefix = `${severityColour}${`[${severity}]`.padEnd(10, " ")}${AnsiReset} ${this.loggerColour}[${this.loggerName}]${AnsiReset} `;

        if (this.logMode === "server") {
            return `${logPrefix}${message}`;
        }
        if (this.logMode === "user") {
            const userLabels = this.labels as LogLabels<"user">;
            return `${logPrefix}(${userLabels.username} - ${userLabels.appVersion}) ${message}`;
        }
        if (this.logMode === "api") {
            const { request, response, latency } = message as LogOptions<"api">;

            const requestBody = (request as RequestWithBodyContent).bodyContent;
            const responseBody = (response as ResponseWithBodyContent).bodyContent;

            const apiLog = `${request.method} ${request.originalUrl || request.url} ${response.statusCode} ${(latency / 1000).toFixed(3)}s \nREQUEST BODY: ${JSON.stringify(requestBody) || ""} \nRESPONSE BODY: ${JSON.stringify(responseBody) || ""}`;
            return `${logPrefix}${apiLog}`;
        }
        throw new Error("Invalid log mode");
    }

    public debug(message: T extends "api" ? LogOptions<T> : string) {
        console.log(this.formatLog("DEBUG", message));
    }
    public info(message: T extends "api" ? LogOptions<T> : string) {
        console.log(this.formatLog("INFO", message));
    }
    public warn(message: T extends "api" ? LogOptions<T> : string) {
        console.warn(this.formatLog("WARN", message));
    }
    public error(message: T extends "api" ? LogOptions<T> : string) {
        console.error(this.formatLog("ERROR", message));
    }
    public critical(message: T extends "api" ? LogOptions<T> : string) {
        console.error(this.formatLog("CRITICAL", message));
    }
}
