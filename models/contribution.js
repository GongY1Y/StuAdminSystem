const Sequelize = require('sequelize');
const db = require('../db.js');

const contribution = db.define('Contribution', {
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    uid: { type: Sequelize.STRING(20), primaryKey: true, allowNull: false },
    name: { type: Sequelize.STRING(20), allowNull: false },
    contribute: { type: Sequelize.STRING(20), allowNull: false }
}, {
    underscored: true,
    tableName: 'contributions'
});

module.exports = contribution;