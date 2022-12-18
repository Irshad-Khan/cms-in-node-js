## File Upload Features

### We learn follwing

1. we need to install npm i express-fileupload
2. We need to register fileupload in app.js
3. This can be use to add file parameter into request object

```bash
const fileUpload = require('express-fileupload');
app.use(fileUpload());
```
