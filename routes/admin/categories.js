const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const { isAuthenticate } = require('../../helpers/authentication');



/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout
 */
router.all('/*',isAuthenticate, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Category.find({}).then((categories) => {
        res.render('admin/categories',
            { categories: categories.map(category => category.toJSON()) });
    });
});

router.get('/create', (req, res) => {
    res.render('admin/categories/create');
});

router.post('/create', (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({name: "Name field is required"});
    }

    if (errors.length > 0) {
        res.render('admin/categories/create', {
            errors: errors
        });
    } else {
        const category = new Category({
            name: req.body.name
        });

        category.save().then((category) => {
            req.flash('success',`Category ${category.name} was created successfully!`);
            res.redirect('/admin/categories');
        }).catch((err) => {
            console.log(err);
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id }).then(category => {
        res.render('admin/categories/edit', {
            category: category.toJSON()
        }); 
    });
});

router.put('/edit/:id', (req, res) => {
    let errors = [];
    if (!req.body.name) {
        errors.push({name: "Name field is required"});
    }

    if (errors.length > 0) {
        res.render('admin/categories/edit', {
            errors: errors
        });
    } else {
       Category.findOne({ _id: req.params.id }).then(category => {
           category.name = req.body.name;
           category.save().then(category => {
               req.flash('success',`Category ${category.name} was updated successfully!`);
            res.redirect('/admin/categories');
           });
        });
    }
});

router.delete('/delete/:id', (req, res) => {
    Category.findOne({ _id: req.params.id }).then(category => {
        req.flash('deleted',`Category ${category.name} was deleted successfully!`);
        category.remove();
        res.redirect('/admin/categories');
    });
});

module.exports = router;