import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { CommandResponse } from "../../typeDefinitions";
import { ErrorCodeLookup } from "../../lookups/stringLookup";
import { ProductInstance } from "../models/entities/productEntity";
import * as DatabaseConnection from "../models/databaseConnection";
import * as ProductRepository from "../models/repositories/productRepository";

export let execute = (productId?: string): Bluebird<CommandResponse<void>> => {
	if ((productId == null) || (productId.trim() === "")) {
		return Bluebird.resolve(<CommandResponse<void>>{ status: 204 });
	}

	let deleteTransaction: Sequelize.Transaction;

	return DatabaseConnection.startTransaction()
		.then((startedTransaction: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
			deleteTransaction = startedTransaction;

			return ProductRepository.queryById(productId, deleteTransaction);
		}).then((queriedProduct: (ProductInstance | null)): Bluebird<void> => {
			if (queriedProduct == null) {
				return Bluebird.resolve();
			}

			return ProductRepository.destroy(queriedProduct, deleteTransaction);
		}).then((): Bluebird<CommandResponse<void>> => {
			deleteTransaction.commit();

			return Bluebird.resolve(<CommandResponse<void>>{ status: 204 });
		}).catch((error: any): Bluebird<CommandResponse<void>> => {
			if (deleteTransaction != null) {
				deleteTransaction.rollback();
			}

			return Bluebird.reject(<CommandResponse<void>>{
				status: (error.status || 500),
				message: (error.message || ErrorCodeLookup.EC1003)
			});
		});
};
