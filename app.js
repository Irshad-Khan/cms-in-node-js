const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');

/**
 * Use when we get post data from form
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Use to connect database
 */
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/cms').then((result) => {
    console.log("Mongo DB Connected");
}).catch((err) => {
    console.log(err);
});

/**
 * Upload Middleware
 */
app.use(fileUpload());

/**
 * We import path moule in top and write below line
 * This use if we want to use static files like css, js or images 
 * or html files
 * With the help of this we can use static assets of application
 */
app.use(express.static(path.join(__dirname,'public')));

/**
 * This is help us to use put method for updating
 */
app.use(methodOverride('_method'));

/**
 * Here we setup our layout of file. When we call render function it look
 * into views fodler and goto layout file fetch home file
 */
const { select,formatIndex,generateDate } = require('./helpers/handlebars-helpers');
const { showError } = require('./helpers/validation-helpers');
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'home',
    helpers: { select: select, formatIndex: formatIndex, showError: showError, generateDate:generateDate }
}));
app.set('view engine', 'handlebars');

/**
 * Session and Flash
 */
app.use(session({
    secret: 'keyboard cat', //It should be any it may be your name etc
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

app.use(flash());

/**
 * Local vairbale use middleware
 */
app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.deleted = req.flash('deleted');
    next();
});

/**
 * Routes
 */
const homeRoutes = require('./routes/home/index');
const adminRoutes = require('./routes/admin/index');
const postsRoutes = require('./routes/admin/posts');
const categoriesRoutes = require('./routes/admin/categories');
app.use('/',homeRoutes);
app.use('/admin',adminRoutes);
app.use('/admin/posts',postsRoutes);
app.use('/admin/categories',categoriesRoutes);



const port = process.env.port || 4500;
app.listen(4500, () => {
    console.log(`Listening port ${port}`);
});