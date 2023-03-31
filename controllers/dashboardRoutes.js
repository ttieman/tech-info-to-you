const router = require('express').Router();
const auth = require('../utils/auth');
// Import the custom middleware


router.get('/', auth ,async (req, res) => {
    try {
        res.render('homepage', {
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
