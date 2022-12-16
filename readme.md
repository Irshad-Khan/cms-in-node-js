## Third Leacture adding register and login view

### We learn follwing

1. First we create two files login and register in view/home folder

2. Then we add nav item in partials/home/nav.handlebars file for login and register

3. After that we add route of register and login

```bash
    app.get('/login', (req, res) => {

        res.render('home/login');

    });

    app.get('/register', (req, res) => {

        res.render('home/register');

    });
```

## Creating New Route File

1. In this sectin we create new main.js file for route of home section. We cut all routes from app.js and paste into that file.

2. In app.js we add below code to import and use main routes file. IN below code use() is a middleware in nodejs. It mean when we come to / route it execute mainRoutes file

```bash
    const mainRoutes = require('./routes/home/main');
    app.use('/',mainRoutes);
```

3. In main.js route file we add route and some below extra configuration.

```bash
    const express = require('express');
    const router = express.Router();

    #HERE WE ADD OUR ROUTES

    module.exports = router;
```
