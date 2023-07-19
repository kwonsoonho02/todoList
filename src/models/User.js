"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    userid: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    userpassword: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    timestamps: false,
    modelName: 'User',
    tableName: 'users',
});
database_1.default.sync({
    alter: true
})
    .then(() => {
    console.log('데이터베이스와 모델 User 동기화 완료');
})
    .catch((error) => {
    console.error('동기화 오류:', error);
});
exports.default = User;
