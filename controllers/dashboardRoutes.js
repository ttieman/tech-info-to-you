const router = require('express').Router();
const auth = require('../utils/auth');
const { Post, User, Comment } = require('../models');
// Import the custom middleware

// GET all posts for homepage for the user who is logged in
router.get('/', auth, async (req, res) => {
    try {
        // Get all posts and JOIN with user data
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));
        // Pass serialized data and session flag into template
        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// get edit post page
router.get('/edit/:id', auth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const post = postData.get({ plain: true });
        res.render('edit-post', {
            post,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all posts from all users sorted by timestamp
router.get('/all', auth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render('all-posts', {
            posts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});





module.exports = router;
