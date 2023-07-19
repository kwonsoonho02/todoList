"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class List extends sequelize_1.Model {
}
exports.List = List;
List.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'List',
    tableName: 'lists',
});
