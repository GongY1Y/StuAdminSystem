const Sequelize = require('sequelize');
const db = require('../db.js');

const course = db.define('Course', {
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    cid: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(20), allowNull: false },
    score: { type: Sequelize.INTEGER, allowNull: false },
    time: { type: Sequelize.INTEGER, allowNull: false },
    teacher: { type: Sequelize.STRING(20), allowNull: false },
    uid: { type: Sequelize.STRING(20), allowNull: false }
}, {
    underscored: true,
    tableName: 'courses'
});

module.exports = course;