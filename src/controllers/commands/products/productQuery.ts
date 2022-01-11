import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { CommandResponse, Product } from "../../typeDefinitions";
import { ProductInstance } from "../models/entities/productEntity";
import * as ProductRepository from "../models/repositories/productRepository";

const mapProductData = (queriedProduct: ProductInstance): Product => {
	return <Product>{
		id: queriedProduct.id,
		count: queriedProduct.count,
		lookupCode: queriedProduct.lookupCode,
		createdOn: Helper.formatDate(queriedProduct.createdOn)
	};
};

export let queryById = (recordId?: string): Bluebird<CommandResponse<Product>> => {
	if (!recordId || (recordId.trim() === "")) {
		return Bluebird.reject(<CommandResponse<Product>>{
			status: 422,
			message: ErrorCodeLookup.EC2025
		});
	}

	return ProductRepository.queryById(recordId)
		.then((existingProduct: (ProductInstance | null)): Bluebird<CommandResponse<Product>> => {
			if (!existingProduct) {
				return Bluebird.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Bluebird.resolve(<CommandResponse<Product>>{
				status: 200,
				data: mapProductData(existingProduct)
			});
		});
};

export let queryByLookupCode = (productLookupCode?: string): Bluebird<CommandResponse<Product>> => {
	if (!productLookupCode || (productLookupCode.trim() === "")) {
		return Bluebird.reject(<CommandResponse<Product>>{
			status: 422,
			message: ErrorCodeLookup.EC2026
		});
	}

	return ProductRepository.queryByLookupCode(productLookupCode)
		.then((existingProduct: (ProductInstance | null)): Bluebird<CommandResponse<Product>> => {
			if (!existingProduct) {
				return Bluebird.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return Bluebird.resolve(<CommandResponse<Product>>{
				status: 200,
				data: mapProductData(existingProduct)
			});
		});
};
