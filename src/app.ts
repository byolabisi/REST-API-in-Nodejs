import * as fs from "fs";
import dotenv from "dotenv";
import * as restify from "restify";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

export let api = restify.createServer({
	version: "0.0.1",
	name: "register-api"
});

api.pre(restify.pre.sanitizePath());
api.use(restify.plugins.acceptParser(api.acceptable));
api.use(restify.plugins.bodyParser());
api.use(restify.plugins.queryParser());
api.use(restify.plugins.authorizationParser());
api.use(restify.plugins.fullResponse());

fs.readdirSync(__dirname + "/routes").forEach(function (routeConfig: string) {
	if (routeConfig.substr(-3) === ".js") {
		require(__dirname + "/routes/" + routeConfig)
			.routes(api);
	}
});

export default api;
