const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const { faker } = require('@faker-js/faker');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
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
    /**
     * The cleanest method is to make sure the the handlebars-input
     *  is a proper plain javascript object. This can be done in Mongoose,
     *  by calling toJSON() or toObject
     */
    Post.find({}).populate('category').then((posts) => {
        res.render('admin/posts',
            { posts: posts.map(post => post.toJSON()) });
    });
});

router.get('/create', (req, res) => {
    Category.find({}).then(categories => {
        res.render('admin/posts/create', {
            categories: categories.map(category => category.toJSON())
        });
    });
});

router.post('/create', (req, res) => {

    let errors = [];

    if (!req.body.title) {
        errors.push({ title: 'title is required' });
    }

    if (!req.body.body) {
        errors.push({ body: 'body is required' });
    }

    if (!req.body.allowComments) {
        errors.push({ allowComments: 'Allow Comments is required' });
    }

    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        });
    } else {
        let fileName = "default.jpg";
        if (!isEmpty(req.files)) {
            let file = req.files.file;
            fileName = Date.now()+'-'+file.name;
            file.mv("./public/uploads/" + fileName, (err) => {
                if (err) throw err; 
            });
        }   

        let allowComments = true;
        if (req.body.allowComments) {
            allowComments = true;
        } else {
            allowComments = false;
        }

        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments,
            body: req.body.body,
            file: fileName,
            category: req.body.category,
            user: req.user._id
        });

        newPost.save().then((result) => {
            req.flash('success',`Post ${result.title} was created successfully!`);
            res.redirect('/admin/posts');
        }).catch((err) => {
            console.log(err);
        });
    }
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
        Category.find({}).then(categories => { 
            res.render('admin/posts/edit', {
                post: post.toJSON(),
                categories: categories.map(category => category.toJSON())
            }); 
        });
    });
});

router.put('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {

            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            post.user = req.user._id;
            post.title = req.body.title;
            post.allowComments = allowComments;
            post.status = req.body.status;
            post.body = req.body.body;
            post.category = req.body.category;

            if (!isEmpty(req.files)) {
                let file = req.files.file;
                fileName = Date.now() + '-' + file.name;
                post.file = fileName;
                file.mv("./public/uploads/" + fileName, (err) => {
                    if (err) throw err; 
                });
            }
            
            post.save().then(updatedPost => {
                req.flash('success',`Post ${updatedPost.title} was updated successfully!`);
                res.redirect('/admin/posts');
            });

        });
});

router.delete('/delete/:id', (req, res) => {
    Post.findOne({ _id: req.params.id })
        .populate('comments')
        .then((post) => {
            fs.unlink(uploadDir + post.file, () => {
                if (!post.comments.length < 1) {
                    post.comments.forEach(comment => {
                        comment.remove(); 
                    });
                }
                req.flash('deleted',`Post ${post.title} was deleted successfully!`);
                post.remove();
                res.redirect('/admin/posts');
            })
        });
});

router.get('/generate-fake-data/:amount', (req, res) => {
    
    for (let index = 0; index < req.params.amount; index++) {
        let post = new Post();
        post.title = faker.name.jobTitle();
        post.status = 'public';
        post.allowComments = true;
        post.body = faker.lorem.sentences();

        post.save().then(savedPost => {
            res.send('Data Inserted');
        }).catch(err => {
            console.log(err);
        });
    }
});


module.exports = router;