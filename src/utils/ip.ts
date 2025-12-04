import { Request } from "express";

export function getIp(req: Request): string {
    const xForwardedIp = req.headers["x-forwarded-for"];
    if (xForwardedIp) {
        if (Array.isArray(xForwardedIp)) {
            return xForwardedIp[0].split(",")[0];
        } else if (typeof xForwardedIp === "string") {
            return xForwardedIp.split(",")[0];
        }
    }

    const forwardedIp = req.headers["forwarded"];
    if (forwardedIp) {
        const forMatch = forwardedIp.match(/for=([^;,\s]+)/);
        if (forMatch) {
            return forMatch[1];
        }
    }
    if (req.ip) return req.ip;
    throw new Error("Unable to determine IP address");
}
