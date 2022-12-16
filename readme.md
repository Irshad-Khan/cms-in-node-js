## First Leacture

### We learn follwing

1. First we include package in above of app.js

```bash
    const express = require('express');
    const app = express();
    const path = require('path');
    const exphbs = require('express-handlebars');
```

2. First we setup for static content and added this line in app.js

```bash
app.use(express.static(path.join(__dirname,'public')));
```

3. After that we integrate package express-handlebars for handling layouts and template. As we know handlebars and jade are template engine for nodejs but we are using handlebars. For setting up this we added below lines in app.js:

```bash
   app.engine('handlebars', exphbs.engine({ defaultLayout: 'home' }));
   app.set('view engine', 'handlebars');
```

4. After that we use render function in route this will go to views folder and then goes to layouts folder and run defaultlauot home file that set above

## Second Leacture

### We learn follwing

1. In this lecture we start adding css folder and add blog-home css and bootstrap file and chane in home layout file for css path.

2. Then we cut all html code withing container that was row div and add it into index.handlebars in home folder. and we put in layout container below code that indicate that other file content goes there.

```bash
 {{{body}}}
```

3. After that we use partials. In this step we create new folder partials in views folder and home and admin folder. In home folder we add nav.handlebars file. We cut nav html from home layout file and paste into partials. We use below code in home layout to include partials. In below code symbol > automic hit partials folder and we add other folder path

```bash
   {{> home/nav }}
```

4. After adding nav partial we folow same steps for footer partials

```bash
   {{> home/footor }}
```
