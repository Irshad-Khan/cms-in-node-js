const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;


    Post.find({})
        .skip((perPage*page)-perPage)
        .limit(perPage)
        .then(posts => {
            Post.count().then(postCount => {
                Category.find({}).then(categories => {
                    res.render('home/index', {
                        posts: posts.map(post=>post.toJSON()),
                        categories: categories.map(category => category.toJSON()),
                        current: parseInt(page),
                        pages: Math.ceil(postCount/perPage)
                    }); 
                });
            });
    });
});

router.get('/login', (req, res) => {
    res.render('home/login');
});


passport.use(new LocalStrategy({
    usernameField: 'email',
}, (email, password, done) => {
    User.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'No user found' });
        
        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) return err;

            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Incorrect email or password'});
            }
        });
    });   
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user.toJSON());
    });
});

router.post('/login', (req, res, next) => {
     let errors = [];

    if (!req.body.email) {
        errors.push({ email: 'Email is required' });
    }

    if (!req.body.password) {
        errors.push({ password: 'Password is required' });
    }

    if (errors.length > 0) {
        res.render('home/login', {
            errors: errors
        });
    } else {
        
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);



    }
});

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
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

router.get('/post/:slug', (req, res) => {
    Post.findOne({ slug: req.params.slug }).populate('user').populate({ path: 'comments', match: {approvedComment: true}, populate:{path: 'user', model: 'users'}}).then(post => {
         Category.find({}).then(categories => {
            res.render('home/post', {
                post: post.toJSON(),
                categories: categories.map(category=>category.toJSON())
            });
        });
    });
});

module.exports = router;