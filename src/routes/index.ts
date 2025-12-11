import AppRouter from "./AppRouter";
import { HttpStatusCodes } from "@/utils/enums/http";
import carModelRouter from "./car-models";

const router = new AppRouter();

// Default message for base route
router.get("/", (_req, res) => {
    res.status(HttpStatusCodes.Success.OK).json({ message: "Welcome to Motive Backend!" });
});

router.use("/car-models", carModelRouter);

export default router;
