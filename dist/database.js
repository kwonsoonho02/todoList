"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('todolist', 'root', '0414', {
    host: 'localhost',
    dialect: 'mariadb'
});
exports.default = sequelize;
