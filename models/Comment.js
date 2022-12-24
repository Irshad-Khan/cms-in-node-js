const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'  
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    approvedComment: {
        type: Boolean
    },
    slug: {
      type: String  
    }

});

CommentSchema.plugin(URLSlugs('body', { field: 'slug' }));

module.exports = mongoose.model('comments', CommentSchema);