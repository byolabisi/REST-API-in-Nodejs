import Bluebird from "bluebird";
import Sequelize from "sequelize";
import { ProductFieldName } from "../constants/fieldNames/productFieldNames";
import { ProductAttributes, ProductEntity, ProductInstance } from "../entities/productEntity";

export let queryById = (id: string, queryTransaction?: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
	return ProductEntity.findOne(<Sequelize.FindOptions<ProductAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<ProductAttributes>>{ id: id }
	});
};

export let queryByLookupCode = (lookupCode: string, queryTransaction?: Sequelize.Transaction): Bluebird<ProductInstance | null> => {
	return ProductEntity.findOne(<Sequelize.FindOptions<ProductAttributes>>{
		transaction: queryTransaction,
		where: <Sequelize.WhereOptions<ProductAttributes>>{ lookupCode: lookupCode }
	});
};

export let queryAll = (): Bluebird<ProductInstance[]> => {
	return ProductEntity.findAll(<Sequelize.FindOptions<ProductAttributes>>{
		order: [ [ProductFieldName.CreatedOn, "ASC"] ]
	});
};

export let create = (newProduct: ProductAttributes, createTransaction?: Sequelize.Transaction): Bluebird<ProductInstance> => {
	return ProductEntity.create(
		newProduct,
		<Sequelize.CreateOptions>{
			transaction: createTransaction
		});
};

export let destroy = (productListEntry: ProductInstance, destroyTransaction?: Sequelize.Transaction): Bluebird<void> => {
	return productListEntry.destroy(
		<Sequelize.InstanceDestroyOptions>{
			transaction: destroyTransaction
		});
};
