import AppRouter from "./AppRouter";
import { HttpStatusCodes } from "@/enums/http";

const router = new AppRouter();

// Default message for base route
router.get("/", (_req, res) => {
    res.status(HttpStatusCodes.Success.OK).json({ message: "Welcome to Comics Dash Backend!" });
});

export default router;
