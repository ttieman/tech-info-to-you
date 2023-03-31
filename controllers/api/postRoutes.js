const router = require('express').Router();


const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {  //http://localhost:3001/api/posts
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.redirect('/');
    } catch (err) {
        res.status(400).json(err);
    }
});
//newpost 
// get new post page
router.get('/newpost', withAuth, async (req, res) => {  //http://localhost:3001/api/posts/newpost
    try {
        res.render('newpost', {
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//update a post
router.put('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.update(
            {
                title: req.body.title,
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a post
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        if (postData.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You do not have permission to delete this post!' });
            return;
        }
        await Post.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        res.status(500).json(err);
        
    }});



   

module.exports = router;