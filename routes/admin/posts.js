const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { faker } = require('@faker-js/faker');


/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout
 */
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    /**
     * The cleanest method is to make sure the the handlebars-input
     *  is a proper plain javascript object. This can be done in Mongoose,
     *  by calling toJSON() or toObject
     */
    Post.find({}).then((posts) => {
        res.render('admin/posts',
            { posts: posts.map(post => post.toJSON()) });
    });
});

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
});

router.post('/create', (req, res) => {

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
    });

    newPost.save().then((result) => {
        res.redirect('/admin/posts');
    }).catch((err) => {
        console.log(err);
    });
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
        res.render('admin/posts/edit', {
            post: post.toJSON()
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

            post.title = req.body.title;
            post.allowComments = allowComments;
            post.status = req.body.status;
            post.body = req.body.body;

            post.save().then(updatedPost => {
                res.redirect('/admin/posts');
            });

        });
});

router.delete('/delete/:id', (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then((result) => {
            res.redirect('/admin/posts');
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