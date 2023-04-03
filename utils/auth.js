const loggedIn = (req, res, next) => {
    if (!req.session.loggedIn || !req.session.user_id) {
        console.log('you must log in first');
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = loggedIn;