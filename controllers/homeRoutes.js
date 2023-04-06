const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => { //http://localhost:3001/
  try {
    //get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: ['id', 'title', 'content', 'createdAt'],
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: User,
          attributes: ['username'],
          exclude: ['password'],
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


    //serialize data so template can read it
    // need to map over it because this is an array of objects
    const posts = postData.map((post) => post.get({ plain: true }));
    const user_id = req.session.user_id;
    const logged_in = req.session.loggedIn;

    res.render('home', {
      posts,
      logged_in,
      user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get single post by id 
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