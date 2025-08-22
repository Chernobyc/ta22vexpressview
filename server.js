const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const db = require('./models/index');
const paginate = require('./pagination');
const session = require('express-session');


const cookie_secret = 'kaspar-app-cool'

app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: cookie_secret,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 20;
    let posts = await db.Post.findAll({
        offset: (page-1) * perPage,
        limit: perPage
    });
    let pages = Math.ceil(await db.Post.count()/perPage);
    let pagination = paginate(page, pages, perPage);
    res.render('index.njk', {posts, pagination});
});
app.get('/answer', (req, res) => {
    console.log(req.query);
    res.render('answer.njk', req.query);
});
app.post('/answer', (req, res) => {
    console.log(req.body);
    res.render('answer.njk', { ...req.query, ...req.body });
});

app.use('/posts', require('./controllers/postController'));
app.use('/', require('./controllers/authController'));

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});