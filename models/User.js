const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    slug: {
      type: String  
    }

});
UserSchema.plugin(URLSlugs('email', { field: 'slug' }));

module.exports = mongoose.model('users', UserSchema);