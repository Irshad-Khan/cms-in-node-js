const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

/**
 * We import path moule in top and write below line
 * This use if we want to use static files like css, js or images 
 * or html files
 * With the help of this we can use static assets of application
 */
app.use(express.static(path.join(__dirname,'public')));

/**
 * Here we setup our layout of file. When we call render function it look
 * into views fodler and goto layout file fetch home file
 */
app.engine('handlebars', exphbs.engine({ defaultLayout: 'home' }));
app.set('view engine', 'handlebars');

const homeRoutes = require('./routes/home/index');
const adminRoutes = require('./routes/admin/index');
app.use('/',homeRoutes);
app.use('/admin',adminRoutes);



const port = process.env.port || 4500;
app.listen(4500, () => {
    console.log(`Listening port ${port}`);
});