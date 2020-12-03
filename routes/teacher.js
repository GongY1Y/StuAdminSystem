const express = require('express');
const User = require('../models/user.js');
const Course = require('../models/course.js');
const Score = require('../models/score.js');

const router = express.Router();

// 查看课程
router.get('/course', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(teacher => {
            if (teacher.length !== 0) {
                let name = teacher[0].name;
                Course.findAll({
                    where: {
                        uid: uid
                    }
                }).then(
                    courses => {
                        res.render('teacher/courseT.html', {
                            uid: uid,
                            name: name,
                            course: courses
                        });
                    }
                );
            } else {
                res.render('teacher/tipsT.html', {
                    uid: uid,
                    tip: '账号异常',
                    description: '请尝试重新登录'
                })
            }
        }
    );
});

// 课程评分
router.get('/course/score', (req, res) => {
    let query = req.query;
    User.findAll({
        where: {
            uid: query.uid
        }
    }).then(teacher => {
        Score.findAll({
            where: {
                cid: query.cid
            }
        }).then(students => {
                res.render('teacher/scoreT.html', {
                    uid: query.uid,
                    name: teacher[0].name,
                    student: students
                });
            }
        );
    });
});

// 修改成绩页面
router.get('/course/score/edit', (req, res) => {
    let query = req.query;
    User.findAll({
        where: {
            uid: query.sid
        }
    }).then(students => {
        Course.findAll({
            where: {
                cid: query.cid
            }
        }).then(courses => {
            res.render('teacher/scoreEdit.html', {
                uid: courses[0].uid,
                name: courses[0].teacher,
                cid: courses[0].cid,
                courName: courses[0].name,
                stuName: students[0].name,
                stuId: students[0].uid
            });
        });
    });
});

// 修改成绩
router.post('/course/score/edit', (req, res) => {
    let body = req.body;
    console.log(body);
    Score.update({
        isScore: 1,
        exam: body.score
    }, {
        where: {
            uid: body.stuId,
            cid: body.cid
        }
    }).then(() => {
        res.redirect('/teacher/course/score?uid=' + body.uid + '&cid=' + body.cid);
    });
});

// 删除课程
router.get('/course/delete', (req, res) => {
    let query = req.query;
    Course.destroy({
        where: {
            cid: query.cid
        }
    }).then(() => {
        Score.destroy({
            where: {
                cid: query.cid
            }
        }).then(() => {
            res.redirect('/teacher/course?uid=' + query.uid);
        });
    });
});

// 新增课程 先根据uid找name
router.get('/addCourse', ((req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(
        teacher => {
            res.render('teacher/addCourseT.html', {
                uid: uid,
                name: teacher[0].name
            });
        })
}));

// 新增课程
router.post('/addCourse', (req, res) => {
    let body = req.body;
    Course.create({
        cid: body.cid,
        name: body.name,
        score: parseInt(body.score),
        time: parseInt(body.time),
        teacher: body.teacher,
        uid: body.uid
    }).then(() => {
        res.redirect('/teacher/course?uid=' + body.uid);
    })
});

// 修改密码
router.get('/password', (req, res) => {
    let uid = req.query.uid;
    User.findAll({
        where: {
            uid: uid
        }
    }).then(
        teacher => {
            if (teacher.length !== 0) {
                res.render('teacher/passwordT.html', {
                    name: teacher[0].name,
                    uid: req.query.uid
                });
            } else {
                res.render('teacher/tipsT.html', {
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
    }).then(teachers => {
            if (teachers[0].password !== body.previous) {
                return res.render('teacher/tipsT.html', {
                    uid: body.uid,
                    tip: '密码错误',
                    description: '请重新输入原密码'
                });
            }
            if (body.now1 !== body.now2) {
                return res.render('teacher/tipsT.html', {
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
                res.render('teacher/tipsT.html', {
                    uid: body.uid,
                    tip: '修改成功',
                    description: ''
                });
            });
        }
    );
});

module.exports = router;