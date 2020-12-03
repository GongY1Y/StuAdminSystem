const Sequelize = require('sequelize');
const CONFIG = require('./config');

const MYSQL = CONFIG.MYSQL;
const sequelize = new Sequelize(MYSQL.database, MYSQL.username, MYSQL.password, {
    host: MYSQL.host,
    dialect: 'mysql',

    logging: CONFIG.DEBUG ? console.log : false,

    pool: {
        max: 5,
        min: 1,
        idle: 10000
    },

    timezone:'+08:00'
});

module.exports = sequelize;