const express = require('express');
const User = require('../models/user.js');
const Course = require('../models/course.js');
const Score = require('../models/score.js');
const Contribution = require('../models/contribution.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/index.html');
});

// 学生信息
router.get('/student', (req, res) => {
    User.findAll({
        where: {
            power: 1
        }
    }).then(
        students => {
            res.render('admin/student.html', {
                student: students
            });
        }
    );
});

// 学生信息编辑
router.get('/student/edit', (req, res) => {
    User.findAll({
        where: {
            uid: req.query.uid
        }
    }).then(
        students => {
            res.render('admin/studentEdit.html', {
                name: students[0].name,
                uid: students[0].uid,
                password: students[0].password,
                isMan: students[0].sex === '男',
                age: students[0].age
            })
        }
    );
});

// 学生信息编辑
router.post('/student/edit', (req, res) => {
    let body = req.body;
    User.update({
        age: parseInt(body.age),
        sex: body.sex,
        password: body.password,
        power: parseInt(body.power)
    }, {
        where: {
            uid: body.uid
        }
    }).then(() => {
        res.redirect('/admin/student');
    });
});

// 学生信息删除
router.get('/student/delete', (req, res) => {
    let uid = req.query.uid;
    User.destroy({
        where: {
            uid: uid
        }
    }).then(() => {
        Score.destroy({
            where: {
                uid: uid
            }
        }).then(() => {
            Contribution.destroy({
                where: {
                    uid: uid
                }
            }).then(() => {
                res.redirect('/admin/student');
            });
        });
    });
});

// 教师信息
router.get('/teacher', (req, res) => {
    User.findAll({
        where: {
            power: 2
        }
    }).then(
        teachers => {
            res.render('admin/teacher.html', {
                teacher: teachers
            })
        }
    );
});

// 教师信息编辑
router.get('/teacher/edit', (req, res) => {
    User.findAll({
        where: {
            uid: req.query.uid
        }
    }).then(
        teachers => {
            res.render('admin/teacherEdit.html', {
                name: teachers[0].name,
                uid: teachers[0].uid,
                password: teachers[0].password,
                isMan: teachers[0].sex === '男',
                age: teachers[0].age
            })
        }
    );
});

// 教师信息编辑
router.post('/teacher/edit', (req, res) => {
    let body = req.body;
    User.update({
        age: parseInt(body.age),
        sex: body.sex,
        password: body.password,
        power: parseInt(body.power)
    }, {
        where: {
            uid: body.uid
        }
    }).then(() => {
        res.redirect('/admin/teacher');
    });
});

// 教师信息删除
router.get('/teacher/delete', (req, res) => {
    let uid = req.query.uid;
    User.destroy({
        where: {
            uid: uid
        }
    }).then(() => {
        Course.destroy({
            where: {
                uid: uid
            }
        }).then(() => {
            Score.destroy({
                where: {
                    tid: uid
                }
            }).then(() => {
                res.redirect('/admin/teacher');
            });
        });
    });
});

// 课程信息
router.get('/course', (req, res) => {
    Course.findAll().then(courses => {
        res.render('admin/courseAdmin.html', {
            course: courses
        });
    });
});

// 社会成果总览
router.get('/contribute', (req, res) => {
    Contribution.findAll().then(
        contributions => {
            res.render('admin/contribution.html', {
                contribution: contributions
            });
        }
    );
});

// 删除社会成果
router.get('/contribute/delete', (req, res) => {
    Contribution.destroy({
        where: {
            id: req.query.id
        }
    }).then(() => {
        res.redirect('/admin/contribute');
    });
});

// 新增社会成果
router.get('/addContribution', (req, res) => {
    res.render('admin/addContribution.html');
});

// 新增社会成果
router.post('/addContribution', (req, res) => {
    let body = req.body;
    User.findAll({
        where: {
            uid: body.uid,
            name: body.name,
            power: 1
        }
    }).then(
        users => {
            if (users.length !== 0) {
                Contribution.create({
                    uid: body.uid,
                    name: body.name,
                    contribute: body.contribution
                }).then(() => {
                    res.redirect('/admin/contribute');
                });
            } else {
                res.render('admin/tipsAdmin.html', {
                    tip: '不存在该学生',
                    description: '请再次确认该用户的姓名、学号'
                })
            }
        }
    )
});

// 新增账号
router.get('/addUser', (req, res) => {
    res.render('admin/addUser.html');
});

// 新增账号，若 uid 已存在则提示
router.post('/addUser', (req, res) => {
    let body = req.body;
    User.findAll({
        where: {
            uid: body.uid
        }
    }).then(
        user => {
            if (user.length !== 0) {
                return res.render('admin/tipsAdmin.html', {
                    tip: 'ID已存在',
                    description: '请再次确认新用户的学号/教工号'
                })
            }
            User.create({
                uid: body.uid,
                name: body.name,
                age: parseInt(body.age),
                sex: body.sex,
                password: body.password,
                power: parseInt(body.power)
            }).then(() => {
                if (body.power === '1') {
                    res.redirect('/admin/student');
                } else {
                    res.redirect('/admin/teacher');
                }
            });
        }
    );
});

// 修改密码
router.get('/password', (req, res) => {
    res.render('admin/passwordAdmin.html');
});

// 修改密码
router.post('/password', (req, res) => {
    let body = req.body;
    User.findAll({
        where: {
            power: 3
        }
    }).then(
        admin => {
            if (admin[0].password !== body.previous) {
                return res.render('admin/tipsAdmin.html', {
                    tip: '密码错误',
                    description: '请重新输入原密码'
                });
            }
            if (body.now1 !== body.now2) {
                return res.render('admin/tipsAdmin.html', {
                    tip: '新密码不一致',
                    description: '请重新确认两次新密码'
                });
            }
            User.update({
                password: body.now1
            }, {
                where: {
                    power: 3
                }
            }).then(() => {
                res.render('admin/tipsAdmin.html', {
                    tip: '修改成功',
                    description: ''
                });
            });
        }
    );
});

module.exports = router;
