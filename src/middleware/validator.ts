import { createValidator } from "@/utils/validator";

const requestValidatorBase = createValidator({ statusCode: 400 });
const responseValidatorBase = createValidator({ statusCode: 500 });

export const paramValidator = requestValidatorBase.params;
export const queryValidator = requestValidatorBase.query;
export const bodyValidator = requestValidatorBase.body;
export const headerValidator = requestValidatorBase.headers;
export const responseValidator = responseValidatorBase.response;
