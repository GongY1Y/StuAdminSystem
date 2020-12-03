const express = require('express');
const User = require('../models/user.js');

const router = express.Router();

// 首页，默认跳转到登录页
router.get('/', (req, res) => {
    res.redirect('/login');
});

// 登录界面
router.get('/login', (req, res) => {
    res.render('login.html');
});

// 验证用户名和密码是否正确
router.get('/verification', (req, res) => {
    User.findAll().then(
        users => {
            let value, power = 0;
            for (let i = 0; i < users.length; i++) {
                if (users[i].dataValues.uid === req.query.uid && users[i].dataValues.password === req.query.password) {
                    value = users[i].dataValues;
                    power = value.power;
                    break;
                }
            }
            if (power === 1) {
                res.redirect('/student/info?uid=' + value.uid);
            } else if (power === 2) {
                res.redirect('/teacher/course?uid=' + value.uid);
            } else if (power === 3) {
                res.redirect('/admin/student');
            } else {
                res.redirect('/login');
            }
        }
    );
});

module.exports = router;
