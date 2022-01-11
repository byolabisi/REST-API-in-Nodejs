import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { ProductInstance } from "../models/entities/productEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as ProductRepository from "../models/repositories/productRepository";
import { CommandResponse, Product, ProductSaveRequest } from "../../typeDefinitions";

const validateSaveRequest = (saveProductRequest: ProductSaveRequest): CommandResponse<Product> => {
	const validationResponse: CommandResponse<Product> =
		<CommandResponse<Product>>{ status: 200 };

	if ((saveProductRequest.id == null) || (saveProductRequest.id.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2025;
	} else if ((saveProductRequest.lookupCode == null) || (saveProductRequest.lookupCode.trim() === "")) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2026;
	} else if ((saveProductRequest.count == null) || isNaN(saveProductRequest.count)) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2027;
	} else if (saveProductRequest.count < 0) {
		validationResponse.status = 422;
		validationResponse.message = ErrorCodeLookup.EC2028;
	}

	return validationResponse;
};

export let execute = (saveProductRequest: ProductSaveRequest): Bluebird<CommandResponse<Product>> => {
	const validationResponse: CommandResponse<Product> = validateSaveRequest(saveProductRequest);
	if (validationResponse.status !== 200) {
		return Bluebird.reject(validationResponse);
	}

	let updateTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
			updateTransaction = startedTransaction;

			return ProductRepository.queryById(<string>saveProductRequest.id, updateTransaction);
		}).then((queriedProduct: (ProductInstance | null)): Bluebird<ProductInstance> => {
			if (queriedProduct == null) {
				return Bluebird.reject(<CommandResponse<Product>>{
					status: 404,
					message: ErrorCodeLookup.EC1001
				});
			}

			return queriedProduct.update(
				<Object>{
					count: saveProductRequest.count,
					lookupCode: saveProductRequest.lookupCode
				},
				<Sequelize.InstanceUpdateOptions>{ transaction: updateTransaction });
		}).then((updatedProduct: ProductInstance): Bluebird<CommandResponse<Product>> => {
			updateTransaction.commit();

			return Bluebird.resolve(<CommandResponse<Product>>{
				status: 200,
				data: <Product>{
					id: updatedProduct.id,
					count: updatedProduct.count,
					lookupCode: updatedProduct.lookupCode,
					createdOn: Helper.formatDate(updatedProduct.createdOn)
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Product>> => {
			if (updateTransaction != null) {
				updateTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<Product>>{
				status: (error.status || 500),
				message: (error.messsage || ErrorCodeLookup.EC1002)
			});
		});
};
