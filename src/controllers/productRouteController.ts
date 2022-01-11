import Bluebird from "bluebird";
import * as restify from "restify";
import * as ProductQuery from "./commands/products/productQuery";
import * as ProductsQuery from "./commands/products/productsQuery";
import { ParameterLookup, ErrorCodeLookup } from "./lookups/stringLookup";
import * as ProductCreateCommand from "./commands/products/productCreateCommand";
import * as ProductDeleteCommand from "./commands/products/productDeleteCommand";
import * as ProductUpdateCommand from "./commands/products/productUpdateCommand";
import { CommandResponse, Product, ProductSaveRequest } from "./typeDefinitions";

export let queryProducts = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	ProductsQuery.query()
		.then((productsQueryCommandResponse: CommandResponse<Product[]>) => {
			res.send(
				productsQueryCommandResponse.status,
				productsQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2001));

			return next();
		});
};

export let queryProductById = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	ProductQuery.queryById(req.params[ParameterLookup.ProductId])
		.then((productQueryCommandResponse: CommandResponse<Product>) => {
			res.send(
				productQueryCommandResponse.status,
				productQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2002));

			return next();
		});
};

export let queryProductByLookupCode = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	ProductQuery.queryByLookupCode(req.params[ParameterLookup.ProductLookupCode])
		.then((productQueryCommandResponse: CommandResponse<Product>) => {
			res.send(
				productQueryCommandResponse.status,
				productQueryCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC2002));

			return next();
		});
};

const saveProduct = (
	req: restify.Request,
	res: restify.Response,
	next: restify.Next,
	performSave: (productSaveRequest: ProductSaveRequest) => Bluebird<CommandResponse<Product>>): void => {

	performSave(req.body)
		.then((productSaveCommandResponse: CommandResponse<Product>) => {
			res.send(
				productSaveCommandResponse.status,
				productSaveCommandResponse.data);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1002));

			return next();
		});
};

export let createProduct = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveProduct(req, res, next, ProductCreateCommand.execute);
};

export let updateProduct = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	saveProduct(req, res, next, ProductUpdateCommand.execute);
};

export let deleteProduct = (req: restify.Request, res: restify.Response, next: restify.Next) => {
	ProductDeleteCommand.execute(req.params[ParameterLookup.ProductId])
		.then((productDeleteCommandResponse: CommandResponse<void>) => {
			res.send(productDeleteCommandResponse.status);

			return next();
		}, (error: any) => {
			res.send(
				(error.status || 500),
				(error.message || ErrorCodeLookup.EC1003));

			return next();
		});
};
