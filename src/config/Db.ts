import mongoose from "mongoose";
import Environment from "./Environment";
import Logger from "@/utils/Logger";
import AnsiColour from "@/utils/enums/log-colours";

export default class Db {
    private static _instance: mongoose.Mongoose | null = null;
    private static _logger = new Logger("Database", AnsiColour.LightMagenta, "server");

    private static get dbUri() {
        return Environment.getEnv("DATABASE_URL");
    }

    public static async connect() {
        this._logger.info("Connecting to database...");
        this._instance = await mongoose.connect(this.dbUri);
        this._logger.info("Database connected.");
        return this._instance;
    }

    public static get instance() {
        if (!this._instance) {
            throw new Error("Database not connected. Call Db.connect() first.");
        }
        return this._instance;
    }
}
