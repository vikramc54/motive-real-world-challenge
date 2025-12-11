import RequestLogger from "@/middleware/RequestLogger";
import { CarModel, carModelApiResponseSchema } from "@/schemas/car-models";
import { InternalServerErrorException } from "@/utils/exceptions/server";

const apiUrl = "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/honda/modelyear/<year>?format=json";

function getApiUrlForYear(year: number) {
    return apiUrl.replace("<year>", year.toString());
}

export async function fetchModelsForYear(year: number) {
    const response = await fetch(getApiUrlForYear(year));

    if (!response.ok) {
        throw new InternalServerErrorException("Failed to fetch data from public API");
    }

    const data = await response.json();

    const validatedResponse = carModelApiResponseSchema.parse(data);

    return validatedResponse.Results;
}

// both inclusive
async function getModelsForRange(from: number, to: number) {
    const getModelPromises: Promise<CarModel[]>[] = [];

    for (let i = from; i <= to; i++) {
        const getModelPromiseForYear = fetchModelsForYear(i);
        getModelPromises.push(getModelPromiseForYear);
    }

    return Promise.all(getModelPromises);
}

function getUniqueModelsAcrossRanges(modelRange: CarModel[][]) {
    const uniqueModels: CarModel[] = [];

    for (const models of modelRange) {
        for (const model of models) {
            if (!uniqueModels.some((uniqueModel) => uniqueModel.Model_ID === model.Model_ID)) {
                uniqueModels.push(model);
            }
        }
    }

    return uniqueModels;
}

function subtractModelSets(largerSet: CarModel[], smallerSet: CarModel[]) {
    return largerSet.filter((carModel) => {
        return !smallerSet.some((carModelInSmallerSet) => carModel.Model_ID == carModelInSmallerSet.Model_ID);
    });
}

export async function getDiscontinuedModelsForYear(year: number) {
    const fromYear = year - 10;
    const yearForDiscontinuation = year - 3;
    const toYear = year - 1;

    RequestLogger.debug(`ranges: ${fromYear}, ${yearForDiscontinuation}, ${toYear}`);

    const [olderRange, recentRange] = await Promise.all([
        getModelsForRange(fromYear, yearForDiscontinuation),
        getModelsForRange(yearForDiscontinuation + 1, toYear),
    ]);

    const uniqueModelsInOlderRange = getUniqueModelsAcrossRanges(olderRange);
    const uniqueModelsInRecentRange = getUniqueModelsAcrossRanges(recentRange);

    RequestLogger.debug(`older models count: ${uniqueModelsInOlderRange.length}`);
    RequestLogger.debug(`newer models count: ${uniqueModelsInRecentRange.length}`);

    const discontinuedModels = subtractModelSets(uniqueModelsInOlderRange, uniqueModelsInRecentRange);

    RequestLogger.debug(`diff count: ${discontinuedModels.length}`);
    return discontinuedModels;
}
