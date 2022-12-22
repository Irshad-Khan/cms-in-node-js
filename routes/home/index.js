const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Post.find({}).then(posts => {
        Category.find({}).then(categories => {
            res.render('home/index', {
                posts: posts.map(post=>post.toJSON()),
                categories: categories.map(category=>category.toJSON())
            }); 
        });
    });
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.get('/register', (req, res) => {
    res.render('home/register');
});

router.post('/register', (req, res) => {
    let errors = [];

    if (!req.body.firstName) {
        errors.push({ firstName: 'First Name is required' });
    }

    if (!req.body.lastName) {
        errors.push({ lastName: 'Last Name is required' });
    }

    if (!req.body.email) {
        errors.push({ email: 'Email is required' });
    }

    if (!req.body.password) {
        errors.push({ password: 'Password is required' });
    }

    if (req.body.password !== req.body.passwordConfirm) {
        errors.push({ password: 'Password does not match' });
    }

    if (errors.length > 0) {
        res.render('home/register', {
            errors: errors
        });
    } else { 
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then((user) => {
                    req.flash('success',`User ${user.email} was created successfully! Please login`);
                    res.redirect('/login');
                }).catch((err) => {
                    console.log(err);
                });
            });    
        });
    }
});

router.get('/post/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then(post => {
         Category.find({}).then(categories => {
            res.render('home/post', {
                post: post.toJSON(),
                categories: categories.map(category=>category.toJSON())
            });
        });
    });
});

module.exports = router;