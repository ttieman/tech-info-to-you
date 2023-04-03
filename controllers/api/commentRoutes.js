const router = require('express').Router();
const { User, Comment, Post } = require('../../models');
const withAuth = require('../../utils/auth');









//update a comment
router.put('/edit/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);
        
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        if(commentData.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You do not have permission to edit this comment!' });
            return;
        }

        await Comment.update(
            {
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );

        res.status(200).json({ message: 'Comment updated successfully!' });
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a comment
router.delete('/delete/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id);
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        if (commentData.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You do not have permission to delete this comment!' });
            return;
        }
        await Comment.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json({ message: 'Comment deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
});


//get new comment page
router.get('/:id', withAuth, async (req, res) => { 
    try {
        const post = await Post.findByPk(req.params.id, {
            include : [
                {
                    model: Comment,
                    attributes: ['id', 'content', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
        });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
       
        const postdata = post.get({ plain: true });
        
        res.render('comment', {
            post: postdata,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

//post a new comment
router.post('/:id', withAuth, async (req, res) => {
    try {
      const newComment = await Comment.create({
        content: req.body.content,
        user_id: req.session.user_id,
        post_id: req.body.post_id,
      });
      //render the single post page
        
        res.redirect(`/post/${req.body.post_id}`);

    } catch (err) {
        res.status(400).json(err);
        }
    });

    
    

    // Get edit comment page for only the user who created the comment
    router.get('/edit/:id', withAuth, async (req, res) => {
      try {
        const commentData = await Comment.findByPk(req.params.id);
        if (!commentData) {
          res.status(404).json({ message: 'No comment found with this id!' });
          return;
        }
        if (commentData.user_id !== req.session.user_id) {
          res.status(403).json({ message: 'You do not have permission to edit this comment!' });
          return;
        }
        const comment = commentData.get({ plain: true });
    
        // Render the 'edit-comment' or 'editcomment' template, depending on the template file name
        res.render('edit-comment', {
            
          comment,
          loggedIn: req.session.loggedIn,
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });

module.exports = router;

