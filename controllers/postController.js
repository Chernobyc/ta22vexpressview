const express = require('express');
const router = express.Router();
const db = require('../models/index');
const paginate = require('../pagination');

router.get('/', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = 20;
    let posts = await db.Post.findAll({
        offset: (page-1) * perPage,
        limit: perPage,
        order: [
            ['createdAt', 'DESC']
        ]
    });
    let pages = Math.ceil(await db.Post.count()/perPage);
    let pagination = paginate(page, pages, perPage);
    res.render('posts/index.njk', {posts, pagination});
});

router.get('/create', async (req, res) => {
    res.render('posts/create.njk');
});

router.post('/', async (req, res) => {
    await db.Post.create({ 
        title: req.body.title,
        body: req.body.body  
    });
    res.redirect('/posts');
});

router.get('/view/:id', async (req, res) => {
    const post = await db.Post.findByPk(req.params.id);
    res.render('posts/view.njk', { post });
});

router.get('/edit/:id', async (req, res) => {
    const post = await db.Post.findByPk(req.params.id);
    res.render('posts/edit.njk', {post});
});

router.post('/edit/:id', async (req, res) => {
    const post = await db.Post.findByPk(req.params.id);
    post.title = req.body.title;
    post.body = req.body.body;
    post.save();
    res.redirect('/posts');
});

router.get('/delete/:id', async (req, res) => {
    const post = await db.Post.findByPk(req.params.id);
    post.destroy();
    res.redirect('/posts');
});

module.exports = router;