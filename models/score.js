const Sequelize = require('sequelize');
const db = require('../db.js');

const score = db.define('Score', {
    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    stuName: { type: Sequelize.STRING(20), allowNull: false },
    uid: { type: Sequelize.STRING(20), allowNull: false },
    courName: { type: Sequelize.STRING(20), allowNull: false },
    cid: { type: Sequelize.STRING(20), allowNull: false },
    teacher: { type: Sequelize.STRING(20), allowNull: false },
    tid: { type: Sequelize.STRING(20), allowNull: false },
    exam: { type: Sequelize.STRING(20) }, // 考试成绩
    score: { type: Sequelize.INTEGER }, // 学分
    isScore: { type: Sequelize.INTEGER } // 是否有成绩，在数据库里设置默认值0
}, {
    underscored: true,
    tableName: 'scores'
});

module.exports = score;