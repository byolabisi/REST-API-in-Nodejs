import * as restify from "restify";
import { RouteLookup } from "../controllers/lookups/stringLookup";
import * as ProductRouteController from "../controllers/productRouteController";

function productRoute(server: restify.Server) {
	server.get({ path: (RouteLookup.API + RouteLookup.Product), version: "0.0.1" }, ProductRouteController.queryProducts);

	server.get({ path: (RouteLookup.API + RouteLookup.Product + RouteLookup.ProductIdParameter), version: "0.0.1" }, ProductRouteController.queryProductById);

	server.get({ path: (RouteLookup.API + RouteLookup.Product + RouteLookup.ByLookupCode + RouteLookup.ProductLookupCodeParameter), version: "0.0.1" }, ProductRouteController.queryProductByLookupCode);

	server.post({ path: (RouteLookup.API + RouteLookup.Product), version: "0.0.1" }, ProductRouteController.createProduct);

	server.put({ path: (RouteLookup.API + RouteLookup.Product + RouteLookup.ProductIdParameter), version: "0.0.1" }, ProductRouteController.updateProduct);

	server.del({ path: (RouteLookup.API + RouteLookup.Product + RouteLookup.ProductIdParameter), version: "0.0.1" }, ProductRouteController.deleteProduct);

	server.get({ path: (RouteLookup.API + RouteLookup.Test + RouteLookup.Product), version: "0.0.1" }, (req: restify.Request, res: restify.Response, next: restify.Next) => {
		res.send(200, "Successful test. (Product routing).");
		return next();
	});
}

module.exports.routes = productRoute;
