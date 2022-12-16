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
