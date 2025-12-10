import { HttpStatusCodes } from "@/utils/enums/http";
import HttpException from "./HttpException";

class InternalServerErrorException extends HttpException {
    constructor(message: string = "Internal Server Error", data: unknown = {}) {
        super(HttpStatusCodes.ServerError.INTERNAL_SERVER_ERROR, message, data);
    }
}

export { InternalServerErrorException };
