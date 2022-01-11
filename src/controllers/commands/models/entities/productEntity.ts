import Sequelize from "sequelize";
import { DatabaseConnection } from "../databaseConnection";
import { DatabaseTableName } from "../constants/databaseTableNames";
import { ProductFieldName } from "../constants/fieldNames/productFieldNames";

const modelName: string = "Product";

export interface ProductAttributes {
	id?: string;
	count: number;
	createdOn?: Date;
	lookupCode: string;
}

export interface ProductInstance extends Sequelize.Instance<ProductAttributes> {
	id: string;
	count: number;
	createdOn: Date;
	lookupCode: string;
}

export let ProductEntity: Sequelize.Model<ProductInstance, ProductAttributes> =
	DatabaseConnection.define<ProductInstance, ProductAttributes>(
		modelName,
		<Sequelize.DefineModelAttributes<ProductAttributes>>{
			id: <Sequelize.DefineAttributeColumnOptions>{
				field: ProductFieldName.ID,
				type: Sequelize.UUID,
				autoIncrement: true,
				primaryKey: true
			},
			lookupCode: <Sequelize.DefineAttributeColumnOptions>{
				field: ProductFieldName.LookupCode,
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: ""
			},
			count: <Sequelize.DefineAttributeColumnOptions>{
				field: ProductFieldName.Count,
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			createdOn: <Sequelize.DefineAttributeColumnOptions>{
				field: ProductFieldName.CreatedOn,
				type: Sequelize.DATE,
				allowNull: true
			}
		},
		<Sequelize.DefineOptions<ProductInstance>>{
			timestamps: false,
			freezeTableName: true,
			tableName: DatabaseTableName.PRODUCT
		});
