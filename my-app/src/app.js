import express        from 'express';
import path           from 'path';
import exphbs         from 'express-handlebars';
import API_UserRouter from './routes/api/Users';
import * as UserLists from './users.json';

const App     = express();
const PORT    = process.env.PORT || 5000;

// Register `hbs.engine` with the Express app.
App.engine("handlebars", exphbs({ defaultLayout: 'main' }));
App.set('view engine', 'handlebars');

// Body parser middleware
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

// Homepage Route
App.get('/', (req, res) => res.render('index', {
    title: 'Users App',
    users: UserLists.users
}));

// Set static folder
App.use(express.static(path.join(__dirname, 'public')));

// Users API Routes
App.use('/api/users', API_UserRouter);

App.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

export default App;