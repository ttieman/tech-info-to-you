const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//create a new comment for a post
router.post('/', withAuth, async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            post_id: req.body.post_id,
        });
        res.status(200).json(newComment);   
    } catch (err) {
        res.status(400).json(err);
    }
});

//update a comment
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentData = await Comment.update(
            {
                content: req.body.content,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        if (!commentData) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }
        if(commentData.user_id !== req.session.user_id) {
            res.status(403).json({ message: 'You do not have permission to edit this comment!' });
            return;
        }
        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a comment
router.delete('/:id', withAuth, async (req, res) => {
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


module.exports = router;