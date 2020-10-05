import express             from 'express';
import path                from 'path';
import exphbs              from 'express-handlebars';
import UserRoutes          from './routes/user';
import mongoose            from 'mongoose';
import flash               from 'connect-flash';
import session             from 'express-session';
import passport            from 'passport';
import DB_CONFIG           from '../config/keys';
import LocalPassportConfig from '../config/passport';

const App  = express();
const PORT = process.env.PORT || 5000;

// Passport Config
LocalPassportConfig(passport);

// Connect to Mongo
mongoose.connect(DB_CONFIG.MongoURI, DB_CONFIG.MongoDB_Options)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Empty helper
const exphbs_isEmpty = value => (typeof value === undefined || value === null || value.length < 1);

// Register `hbs.engine` with the Express app.
App.engine("handlebars", exphbs({
    defaultLayout: 'main',
    helpers: {
        'isEqual'   : (value1, value2) => value1 === value2, 
        'isEmpty'   : value => exphbs_isEmpty(value),
        'isdefined' : value => value !== undefined,
        'notIsEmpty': value => !exphbs_isEmpty(value)
    }
}));

App.set('view engine', 'handlebars');

// Bodyparser Middleware
App.use(express.urlencoded({ extended: true }));

// Express session
App.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
App.use(passport.initialize());
App.use(passport.session());

// Connect flash
App.use(flash());

// Global Vars
App.use((req, res, next) => {
    res.locals.login_error     = req.flash('error');
    res.locals.error_msg       = req.flash('error_msg');
    res.locals.success_msg     = req.flash('success_msg');
    res.locals.user_registered = req.flash('user_registered');
    
    let 
        localNavLinks = [],
        navLinks      = [
            { url: '/', label: 'Home' }
        ];

    if (req.user) {
        navLinks.push({ url: '/dashboard', label: 'Dashboard' });
        // navLinks.push({ url: '/logout',    label: 'Logout' });
    } else {
        navLinks.push({ url: '/login',    label: 'Login' });
        navLinks.push({ url: '/register', label: 'Register' });
    }

    for (let navLink of navLinks) {
        navLink = Object.assign({}, navLink, { currentUrl: req.url } );
        localNavLinks.push(navLink);
    }

    res.locals.nav_links = localNavLinks;

    next();
});
 
// Set static folder
App.use('/public', express.static(path.join(__dirname, '../public')));

// Homepage Route
App.get('/', (req, res) => res.render('index', {
    title : 'Node JS With Passport Authentication',
    layout: 'main'
}));

// Users Routes: Login, Register, Dashboard
App.use('/', UserRoutes);

App.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

export default App;