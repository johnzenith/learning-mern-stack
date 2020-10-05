export default {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Access denied: you are not logged in');
        res.redirect('/login');
    }
}