## Seassion Features

### We learn follwing

1. Installed Seassion Package

```bash
    npm install express-session
```

2. Then installed Flash Package

```bash
    npm install flash-session
```

3. Integration in app.js

```bash
    const session = require('express-session');
    const flash = require('connect-flash');

    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
    }));

    app.use(flash());

    app.use((req,res,next) => {
        res.locals.success = req.flash('success');
        res.locals.deleted = req.flash('deleted');
        next();
    });
```
