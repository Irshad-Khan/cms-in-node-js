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
