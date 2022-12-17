const express = require('express');
const router = express.Router();

/**
 * This code is overide default layout. It mean when url with admin
 * comes it should use admin layout
 */
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index');
});
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

module.exports = router;