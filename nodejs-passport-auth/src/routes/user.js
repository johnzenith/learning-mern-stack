import express          from 'express';
import bcrypt           from 'bcryptjs';
import passport         from 'passport';
import UserModel        from '../../models/User';
import PassportAuthArgs from '../../config/auth';

const UserRoutes = express.Router();

/**
 * Login Route
 */
UserRoutes.get('/login', (req, res) => res.render('login', {
    title: 'Login'
}));

/**
 * Handle Login Request
 */
UserRoutes.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

/**
 * Register Route
 */
UserRoutes.get('/register', (req, res) => res.render('register', {
    title: 'Register',
}));

/** 
 * Handle Registration Request
 */
UserRoutes.post('/register', (req, res) => {
    let errors = [];
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields '});
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Passwords should be at least 8 characters' });
    }

    let regPageData = {
        title: 'Register',
        errors,
        name,
        email,
        password,
        password2
    };

    if (errors.length > 0) {
        res.render('register', regPageData);
    } else {
        UserModel.findOne({ email: email })
            .then(user => {
                // User Exists
                if (user) {
                    regPageData.errors.push({
                        msg: `Email (${email}) is already registered`
                    });

                    res.render('register', regPageData);
                }
                else {
                    const newUser = new UserModel({
                        name,
                        email,
                        password
                    });
                    
                    // Hash the password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (hashErr, hash) => {
                            if (hashErr) {
                                regPageData.errors.push({
                                    msg: 'Unable to complete your registration, please try again'
                                });
                                res.render('register', regPageData);
                                return;
                            }

                            // Use the hashed password
                            newUser.password = hash;

                            // Save the new user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Registration successful!');
                                    req.flash('user_registered', true);

                                    res.redirect('/register');
                                })
                                .catch(userErr => {
                                    // console.log(userErr);
                                    regPageData.errors.push({
                                        msg: 'Registration failed, please try again'
                                    });
                                    res.render('register', regPageData);
                                });
                        });
                    });
                }
            });
    }
});

/**
 * Dashboard Route
 */
UserRoutes.get('/dashboard', PassportAuthArgs.ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        title       : 'Dashboard',
        layout      : 'main',
        userFullName: req.user.name
    })
);

/**
 * Logout Route
 */
UserRoutes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

export default UserRoutes;