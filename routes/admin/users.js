const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcryptjs = require('bcryptjs');

/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout
 */
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    User.find({}).then(users => {
        res.render('admin/users', {
            users: users.map(user => user.toJSON())
        });
    });
});

router.get('/create', (req, res) => {
    res.render('admin/users/create');
});

router.post('/create', (req, res) => {
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

    if (errors.length > 0) {
        res.render('admin/users/create', {
            errors: errors
        });
    } else { 
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });

        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save().then((user) => {
                    req.flash('success',`User ${user.email} was created successfully`);
                    res.redirect('/admin/users');
                }).catch((err) => {
                    console.log(err);
                });
            })
        });


    }
});

router.get('/edit/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then(user => {
        res.render('admin/users/edit', {
            user: user.toJSON()
        });
    });
});

router.put('/edit/:id', (req, res) => {
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

    if (errors.length > 0) {
        res.render('admin/users/edit', {
            errors: errors
        });
    } else { 
        User.findOne({ _id: req.params.id }).then(user => {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.email = req.body.email;

            if (req.body.password) {
                user.password = req.body.password;
                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(user.password, salt, (err, hash) => {
                        user.password = hash;
                        user.save().then((user) => {
                            req.flash('success',`User ${user.email} was updated successfully`);
                            res.redirect('/admin/users');
                        }).catch((err) => {
                            console.log(err);
                        });
                    })
                });
            } else {
                user.save().then((user) => {
                    req.flash('success',`User ${user.email} was updated successfully`);
                    res.redirect('/admin/users');
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }
});

router.delete('/delete/:id', (req, res) => {
    User.findOne({ _id: req.params.id }).then(user => {
        req.flash('deleted',`User ${user.email} was deleted successfully!`);
        user.remove();
        res.redirect('/admin/users');
    });
});
module.exports = router;