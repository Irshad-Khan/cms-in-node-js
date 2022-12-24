const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
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
    Comment.find({user:req.user._id}).populate('user').then(comments => {
        res.render('admin/comments', {
            comments: comments.map(comment => comment.toJSON())
        });    
    });
});


router.post('/', (req, res) => {
    Post.findOne({ id: req.body.post_id }).then(post => {
        const newComent = new Comment({
            user: req.user._id,
            body: req.body.body
        }); 

        post.comments.push(newComent);

        post.save().then(savedPost => {
            newComent.save().then(savedComment => {
                res.redirect(`/post/${post._id}`);
            });
        });
    });
});

router.delete('/delete/:id', (req, res) => {
    Comment.findOne({ _id: req.params.id }).then(comment => {
        Post.findOneAndUpdate({ comments: req.params.id }, { $pull: { comments: req.params.id } }, (err, data) => {
           req.flash('deleted',`Comment was deleted successfully!`);
            comment.remove();
            res.redirect('/admin/comments'); 
        });
    });
});


router.post('/approve-comment', (req, res) => {
    Comment.findByIdAndUpdate(req.body.id, { $set: { approvedComment: req.body.approvedComment } }, (err, result) => {
        if (err) return err;
        res.send(result);
    })
});


module.exports = router;