const loggedIn = (req, res, next) => {
    if (!req.session.loggedIn) {
        console.log('you must log in first');
       res.redirect('/login');
      
    } else{

        next();
    }
}

module.exports = loggedIn;