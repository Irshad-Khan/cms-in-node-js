const express = require('express');
const router = express.Router();
const { isAuthenticate } = require('../../helpers/authentication');
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
    User.findOne({ _id: res.locals.user._id }).then(user => {
        res.render('admin/profile', {
            user: user.toJSON()
        });
    });
});

router.put('/update/:id', (req, res) => {
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
        res.render('admin/profile', {
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
                            res.redirect('/admin/profile');
                        }).catch((err) => {
                            console.log(err);
                        });
                    })
                });
            } else {
                user.save().then((user) => {
                    req.flash('success',`User ${user.email} was updated successfully`);
                    res.redirect('/admin/profile');
                }).catch((err) => {
                    console.log(err);
                });
            }
        });
    }
});

module.exports = router;