const Article = require("../models/article");

// Thêm bài viết mới
exports.createArticle = async (req, res) => {
    try {
        const { title, category, description, content, author, thumbnail, originalLink } = req.body;
        const slug = generateSlug(title);

        const newArticle = new Article({
            title,
            slug,
            category,
            description,
            content,
            author,
            thumbnail,
            originalLink
        });

        await newArticle.save();
        res.redirect('/articles');
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const article = await Article.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ message: 'Cập nhật thành công', article });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật bài viết', error });
    }
};

// Lấy danh sách bài viết
exports.getArticles = async (req, res) => {
    try {
        const { searchTitle, searchAuthor } = req.query; // Lấy các tham số tìm kiếm từ query
        const filter = {};
        if (searchTitle) {
            filter.title = { $regex: searchTitle, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
        }
        if (searchAuthor) {
            filter.author = { $regex: searchAuthor, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
        }
        const articles = await Article.find(filter); // Lấy danh sách bài viết theo bộ lọc

        res.render('articles/list', { articles, searchTitle, searchAuthor });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
        res.status(500).send("Có lỗi xảy ra.");
    }
};

// Tạo slug từ tiêu đề
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Loại bỏ dấu tiếng Việt
        .replace(/[^\w-]+/g, '');  // Loại bỏ ký tự không hợp lệ
};
