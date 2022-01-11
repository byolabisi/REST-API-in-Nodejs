import Bluebird from "bluebird";
import * as Helper from "../helpers/helper";
import { CommandResponse, Product } from "../../typeDefinitions";
import { ProductInstance } from "../models/entities/productEntity";
import * as ProductRepository from "../models/repositories/productRepository";

export let query = (): Bluebird<CommandResponse<Product[]>> => {
	return ProductRepository.queryAll()
		.then((existingProducts: ProductInstance[]): Bluebird<CommandResponse<Product[]>> => {
			return Bluebird.resolve(<CommandResponse<Product[]>>{
				status: 200,
				data: existingProducts.map<Product>((existingProduct: ProductInstance) => {
					return <Product>{
						id: existingProduct.id,
						count: existingProduct.count,
						lookupCode: existingProduct.lookupCode,
						createdOn: Helper.formatDate(existingProduct.createdOn)
					};
				})
			});
		});
};
