const express = require('express');
const User = require('../models/user.js');
const Score = require('../models/score.js');
const Course = require('../models/course.js');
const Contribution = require('../models/contribution.js');

const router = express.Router();

// 查看个人信息
router.get('/info', (req, res) => {
    let query = req.query;
    User.findAll({
        where: {
            uid: query.uid
        }
    }).then(students => {
        Contribution.findAll({
            where: {
                uid: query.uid
            }
        }).then(contributions => {
            res.render('student/stuInfo.html', {
                name: students[0].name,
                uid: students[0].uid,
                sex: students[0].sex,
                age: students[0].age,
                contribution: contributions
            });
        });
    });
});

// 查看成绩
router.get('/score', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(students => {
        Score.findAll({
            where: {
                uid: uid,
                isScore: 1
            }
        }).then(courses => {
            res.render('student/myScore.html', {
                uid: uid,
                name: students[0].name,
                course: courses
            });
        });
    });
});

// 查看课程
router.get('/course', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(students => {
        Score.findAll({
            where: {
                uid: uid,
                isScore: 0
            }
        }).then(courses => {
            res.render('student/myCourse.html', {
                uid: uid,
                name: students[0].name,
                course: courses
            });
        });
    });
});

// 退课
router.get('/myCourse/delete', (req, res) => {
    let query = req.query;
    Score.destroy({
        where: {
            uid: query.uid,
            cid: query.cid
        }
    }).then(() => {
        res.redirect('/student/course?uid=' + query.uid);
    });
});

// 选课页面
router.get('/addCourse', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(students => {
        Course.findAll().then(courses => {
            Score.findAll({
                where: {
                    uid: uid
                }
            }).then(scores => {
                for (let i = 0; i < courses.length; i++) {
                    for (let j = 0; j < scores.length; j++) {
                        if (courses[i].cid === scores[j].cid) {
                            courses[i].dataValues.id = false;
                            break;
                        }
                    }
                }
                res.render('student/addCourseS.html', {
                    uid: uid,
                    name: students[0].name,
                    course: courses
                });
            });
        });
    });
});

// 选课
router.get('/addCourse/add', ((req, res) => {
    let query = req.query;
    User.findAll({
        where: {
            uid: query.uid
        }
    }).then(students => {
        Course.findAll({
            where: {
                cid: query.cid
            }
        }).then(courses => {
            Score.create({
                stuName: students[0].name,
                uid: students[0].uid,
                courName: courses[0].name,
                cid: courses[0].cid,
                teacher: courses[0].teacher,
                tid: courses[0].uid,
                score: courses[0].score
            }).then(() => {
                res.redirect('/student/addCourse?uid=' + query.uid);
            });
        });
    });
}));


// 修改密码
router.get('/password', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(students => {
            if (students.length !== 0) {
                res.render('student/passwordS.html', {
                    name: students[0].name,
                    uid: req.query.uid
                });
            } else {
                res.render('student/tipsS.html', {
                    uid: uid,
                    tip: '账号异常',
                    description: '请尝试重新登录'
                });
            }
        }
    );
});

// 修改密码
router.post('/password', (req, res) => {
    let body = req.body;
    User.findAll({
        where: {
            uid: body.uid
        }
    }).then(students => {
            if (students[0].password !== body.previous) {
                return res.render('student/tipsS.html', {
                    uid: body.uid,
                    tip: '密码错误',
                    description: '请重新输入原密码'
                });
            }
            if (body.now1 !== body.now2) {
                return res.render('student/tipsS.html', {
                    uid: body.uid,
                    tip: '新密码不一致',
                    description: '请重新确认两次新密码'
                });
            }
            User.update({
                password: body.now1
            }, {
                where: {
                    uid: body.uid
                }
            }).then(() => {
                res.render('student/tipsS.html', {
                    uid: body.uid,
                    tip: '修改成功',
                    description: ''
                });
            });
        }
    );
});


module.exports = router;