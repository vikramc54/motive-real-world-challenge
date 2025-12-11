import z from "zod";

export const carModelSchema = z.object({
    Make_ID: z.number().int(),
    Make_Name: z.string(),
    Model_ID: z.number().int(),
    Model_Name: z.string(),
});
export type CarModel = z.infer<typeof carModelSchema>;

export const getCarModelRequestParamSchema = z.object({
    year: z.coerce.number().int(),
});
export type GetCarModelRequestParams = z.infer<typeof getCarModelRequestParamSchema>;

export const getCarModelResponseSchema = z.array(carModelSchema);

export const carModelApiResponseSchema = z.object({
    Results: z.array(carModelSchema),
});

export const getDiscontinuedCarModelsRequestQuerySchema = z.object({
    year: z.coerce.number().int().optional(),
});
export type GetDiscontinuedCarModelsRequestQuery = z.infer<typeof getDiscontinuedCarModelsRequestQuerySchema>;
