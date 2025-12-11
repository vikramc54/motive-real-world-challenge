import { paramValidator, queryValidator, responseValidator } from "@/middleware/validator";
import AppRouter from "./AppRouter";
import {
    GetCarModelRequestParams,
    getCarModelRequestParamSchema,
    getCarModelResponseSchema,
    GetDiscontinuedCarModelsRequestQuery,
    getDiscontinuedCarModelsRequestQuerySchema,
} from "@/schemas/car-models";
import RequestLogger from "@/middleware/RequestLogger";
import { fetchModelsForYear, getDiscontinuedModelsForYear } from "@/controllers/car-models";
import { HttpStatusCodes } from "@/utils/enums/http";

const router = new AppRouter();

router.get(
    "/year/:year",
    paramValidator(getCarModelRequestParamSchema),
    responseValidator(getCarModelResponseSchema),
    RequestLogger.getMiddleware("GetCarModelsForYear"),
    async (req, res, next) => {
        try {
            const { year } = req.params as unknown as GetCarModelRequestParams;

            const models = await fetchModelsForYear(year);

            res.status(HttpStatusCodes.Success.OK).json(models);
        } catch (err) {
            RequestLogger.error(err instanceof Error ? err.message : "Unknown error");
            next(err);
        }
    },
);

router.get(
    "/discontinued",
    queryValidator(getDiscontinuedCarModelsRequestQuerySchema),
    responseValidator(getCarModelResponseSchema),
    RequestLogger.getMiddleware("GetDiscontinuedCarModels"),
    async (req, res, next) => {
        try {
            let { year } = req.query as unknown as GetDiscontinuedCarModelsRequestQuery;
            if (!year) {
                year = new Date().getFullYear();
            }

            const discontinuedModels = await getDiscontinuedModelsForYear(year);

            res.status(HttpStatusCodes.Success.OK).json(discontinuedModels);
        } catch (err) {
            RequestLogger.error(err instanceof Error ? err.message : "Unknown error");
            next(err);
        }
    },
);

export default router;
