import Environment from "./config/Environment";
import Db from "./config/Db";
import AnsiColour from "./utils/enums/log-colours";
import Logger from "./utils/Logger";
import app from "app";

const sysLogger = new Logger("Startup", AnsiColour.LightCyan, "server");

Environment.validate();

// Setup connections and then start server
sysLogger.info("Setting up server...");
Promise.all([Db.connect()]).then(() => {
    app.listen(Environment.getEnv("PORT"), () => {
        sysLogger.info(`Server running on port ${Environment.getEnv("PORT")}`);
    });
});
