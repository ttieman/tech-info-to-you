const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Comment,
          attributes: ['id', 'content', 'post_id', 'user_id', 'createdAt'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
      ],
    });

    // Serialize data so template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    const user_id = req.session.user_id;
    const logged_in = req.session.loggedIn;
    console.log("user_id from session:", req.session.user_id);
    console.log("logged_in from session:", req.session.loggedIn);
    res.render('home', {
      posts,
      logged_in,
      user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
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
    const created_at = post.createdAt;

    // Add a new property 'isAuthor' to each comment object
    post.Comments = post.Comments.map(comment => {
      comment.isAuthor = comment.user_id === req.session.user_id;
      return comment;
    });

    res.render('singlepost', {
      ...post,
      logged_in: req.session.loggedIn,
      user_id: req.session.user_id,
      created_at,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', async (req, res) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('login');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/signup', async (req, res) => {
  try {
    res.render('register');


  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;