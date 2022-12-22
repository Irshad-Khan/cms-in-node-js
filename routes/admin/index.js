const express = require('express');
const router = express.Router();
const { isAuthenticate } = require('../../helpers/authentication');


/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout, here we use isAuthenticate to protect route
 */
router.all('/*',isAuthenticate, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index');
});

module.exports = router;