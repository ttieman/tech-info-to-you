const router = require('express').Router();
const {User} = require('../../models');
const bcrypt = require('bcrypt');
const withAuth = require('../../utils/auth');

router.post('/register', async (req, res) => { //this route is http://localhost:3001/api/users/register
    try {
        if (req.body.password.length < 8) {
            res.render('register', { errorMessage: 'Password must be at least 8 characters long.' });
            return;
        }
        const userData = await User.create({
            username: req.body.username,
            password: req.body.password,
        });

        // Log the user data that was saved to the database
        console.log('User data saved:', userData.toJSON());

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            res.redirect('/');
        });
    } catch (err) {
        console.error('Registration error:', err); // Log the error
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    console.log('Login request received:', req.body); // Log the incoming request data
    try {
        const userData = await User.findOne({ where: { username: req.body.username } });
        console.log('User data:', userData); // Log the retrieved user data

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }
        const validPassword = await userData.validPassword(req.body.password);
        console.log('Password validation:', validPassword); // Log the password validation result

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect username or password, please try again' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;
            console.log('user logged in');
            res.redirect('/');
        });
    } catch (err) {
        console.error('Error:', err); // Log any errors
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // Clear the cookie
            res.clearCookie('connect.sid', { path: '/' });

            // Redirect to the login page
            res.redirect('/login');
            
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;