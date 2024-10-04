const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const Article = require('../models/article');

// Thêm bài viết
router.post('/new', articleController.createArticle);
router.get('/edit/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId); // Tìm bài viết theo ID
        if (!article) {
            return res.status(404).send('Bài viết không tồn tại.');
        }
        res.render('articles/edit', { article });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
});

// Route POST: Cập nhật thông tin bài viết
router.post('/edit/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        const updatedArticleData = {
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            description: req.body.description,
            content: req.body.content,
            thumbnail: req.body.thumbnail,
            status: req.body.status,
        };

        await Article.findByIdAndUpdate(articleId, updatedArticleData);
        res.redirect('/articles'); // Sau khi sửa, chuyển về danh sách bài viết
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
});
router.get('/delete/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId); // Tìm bài viết theo ID
        if (!article) {
            return res.status(404).send('Bài viết không tồn tại.');
        }
        res.render('articles/delete', { article });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
});

// Route POST: Xóa bài viết
router.post('/delete/:id', async (req, res) => {
    try {
        const articleId = req.params.id;
        await Article.findByIdAndDelete(articleId); // Xóa bài viết
        res.redirect('/articles'); // Chuyển về danh sách bài viết
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
});
// Xem danh sách bài viết
router.get('/', articleController.getArticles);

module.exports = router;
