const Sequelize = require('sequelize');
const db = require('../db.js');

const user = db.define('User', {
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(20), allowNull: false },
    age: { type: Sequelize.INTEGER, allowNull: false },
    sex: { type: Sequelize.STRING(20), allowNull: false },
    password: { type: Sequelize.STRING(20), allowNull: false },
    power: { type: Sequelize.INTEGER, allowNull: false } // 管理员-3，教师-2，学生-1
}, {
    underscored: true,
    tableName: 'users'
});

module.exports = user;