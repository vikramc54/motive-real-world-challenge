import AnsiColour from "@/enums/log-colours";
import Logger from "@/utils/Logger";
import { configDotenv } from "dotenv";
import z from "zod";

export default class Environment {
    private static _model = z.object({
        PORT: z
            .string()
            .transform((val) => parseInt(val, 10))
            .default(3000),
        NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
        DATABASE_URL: z.string(),
    });

    private static _env: z.infer<typeof this._model> | null = null;

    private static _logger = new Logger("Environment", AnsiColour.LightMagenta, "server");

    public static validate() {
        if (this._env) return this._env;

        configDotenv({ quiet: true });
        const parsed = this._model.safeParse(process.env);
        if (!parsed.success) {
            this._logger.error(`Environment validation error: ${parsed.error.message}`);
            process.exit(1);
        }
        this._logger.info("Environment variables validated successfully.");

        this._env = parsed.data;
        return this._env;
    }

    public static getEnv<T extends keyof NonNullable<typeof this._env>>(key: T): NonNullable<typeof this._env>[T] {
        if (!this._env) {
            throw new Error("Environment not validated yet. Call Environment.validate() first.");
        }
        return this._env[key];
    }
}
