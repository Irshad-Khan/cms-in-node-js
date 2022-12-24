const express = require('express');
const router = express.Router();
const { isAuthenticate } = require('../../helpers/authentication');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Category = require('../../models/Category');
const User = require('../../models/User');


/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout, here we use isAuthenticate to protect route
 */
router.all('/*',isAuthenticate, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Post.count().then(postCount => {
        Comment.count().then(commentCount => {
            Category.count().then(categoryCount => {
                User.count().then(userCount => {
                    res.render('admin/index', {
                    postCount: postCount,
                    commentCount: commentCount,
                    categoryCount: categoryCount,
                    userCount: userCount
                });
                });
            });
        })
    });
});

module.exports = router;