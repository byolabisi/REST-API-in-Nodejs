import Bluebird from "bluebird";
import Sequelize from "sequelize";
import * as Helper from "../helpers/helper";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import * as DatabaseConnection from "../models/databaseConnection";
import * as ProductRepository from "../models/repositories/productRepository";
import { CommandResponse, Product, ProductSaveRequest } from "../../typeDefinitions";
import { ProductInstance, ProductAttributes } from "../models/entities/productEntity";

const validateSaveRequest = (saveProductRequest: ProductSaveRequest): CommandResponse<Product> => {
	const validationResponse: CommandResponse<Product> =
		<CommandResponse<Product>>{ status: 200 };

	if ((saveProductRequest.lookupCode == null) || (saveProductRequest.lookupCode.trim() === "")) {
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

	const productToCreate: ProductAttributes = <ProductAttributes>{
		count: saveProductRequest.count,
		lookupCode: saveProductRequest.lookupCode
	};

	let createTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((createdTransaction: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
			createTransaction = createdTransaction;

			return ProductRepository.queryByLookupCode(
				saveProductRequest.lookupCode,
				createTransaction);
		}).then((existingProduct: (ProductInstance | null)): Bluebird<ProductInstance> => {
			if (existingProduct != null) {
				return Bluebird.reject(<CommandResponse<Product>>{
					status: 409,
					message: ErrorCodeLookup.EC2029
				});
			}

			return ProductRepository.create(productToCreate, createTransaction);
		}).then((createdProduct: ProductInstance): Bluebird<CommandResponse<Product>> => {
			createTransaction.commit();

			return Bluebird.resolve(<CommandResponse<Product>>{
				status: 201,
				data: <Product>{
					id: createdProduct.id,
					count: createdProduct.count,
					lookupCode: createdProduct.lookupCode,
					createdOn: Helper.formatDate(createdProduct.createdOn)
				}
			});
		}).catch((error: any): Bluebird<CommandResponse<Product>> => {
			if (createTransaction != null) {
				createTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<Product>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1002)
			});
		});
};
