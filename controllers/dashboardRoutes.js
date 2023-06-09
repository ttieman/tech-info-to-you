const router = require('express').Router();
const auth = require('../utils/auth');
const { Post, User, Comment } = require('../models');
// Import the custom middleware

// GET all posts for homepage for the user who is logged in
router.get('/', auth, async (req, res) => {
    try {
        // Get all posts and JOIN with user data
        const postData = await Post.findAll({
            where: {
                user_id: req.session.user_id,  //this needs to match the user_id in the Post model
            },
            attributes: ['id', 'title', 'content', 'createdAt'],

            include: [
                {
                    model: User, //this model needs to match the model in the User model
                    attributes: ['username'], //this attribute needs to match the attribute in the User model
                },
                {  //we include this because we want to see the comments on the dashboard
                    model: Comment,
                    attributes: ['id', 'content', 'post_id', 'user_id', 'createdAt'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },

            ],

        });
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));
        const user = { username: req.session.username };

        // Pass serialized data and session flag into template
        res.render('dashboard', {
            posts,
            loggedIn: req.session.loggedIn,
            user,

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
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['id', 'content', 'post_id', 'user_id', 'createdAt'],
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                        },
                    ],
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

//delete route for your own posts
router.delete('/api/posts/:id', auth, async (req, res) => {  //http://localhost:3001/api/posts/1
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.render('dashboard', {
            loggedIn: req.session.loggedIn,
        });

    } catch (err) {
        res.status(500).json(err);
    }
});








module.exports = router;
