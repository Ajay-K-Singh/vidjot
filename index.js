const express = require('express');
const expressHandlebars = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const ideas = require('./routes/ideas');
const users = require('./routes/users');

const db = require('./config/database');

//connecting mongoose
mongoose.connect(db.mongoURI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

//Load Idea model
require('./models/Ideas');
const idea = mongoose.model('ideas')

//Load passport
require('./config/passport')(passport);


app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');
// Index route
app.get('/', (req, res) => {
    const title = 'Welcome to the application';
    res.render('index', {
        title
    });
});

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method')); //method override

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());


//flash
app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.port || 4000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});