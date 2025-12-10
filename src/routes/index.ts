import AppRouter from "./AppRouter";
import { HttpStatusCodes } from "@/utils/enums/http";

const router = new AppRouter();

// Default message for base route
router.get("/", (_req, res) => {
    res.status(HttpStatusCodes.Success.OK).json({ message: "Welcome to Motive Backend!" });
});

export default router;
