const express=require('express'); //whenever we install a module and we need to bring it in,we use require
const path=require('path');
const exphbs=require('express-handlebars');
const methodOverride=require('method-override');
const flash=require('connect-flash');
const session=require('express-session');
const bodyParser=require('body-parser');
const passport = require('passport');
const mongoose=require('mongoose');

const app=express(); //basically to initalise our application

//Load routes (linking route files to app.js)
const ideas=require('./routes/ideas');
const users=require('./routes/users');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db = require('./config/database');

// map global promise to get rid of warning
mongoose.Promise=global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI)
    .then(()=>console.log('MongoDB connected...'))
    .catch(err=> console.log(err));

//Handlebars Middleware
app.engine('handlebars',exphbs({
    defaultLayout: 'main'
}));// here we are just telling the system that we are using handlebars
app.set('view engine','handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname,'public'))); //sets public folder to the express static folder

//Method Override Middleware
app.use(methodOverride('_method'));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();
});

//Index Route
app.get('/',(req,res)=>{    //whenever we create a route we need request and response object
    const title='Welcome';
    res.render('index',{
        title:title
    });
});//reason of putting get is cause we are handling a get request

//About Route
app.get('/about',(req,res)=>{
    res.render('about');
});

//Use Routes
app.use('/ideas',ideas);
app.use('/users',users);

const port= process.env.PORT || 5000;

app.listen(port,() =>{
    console.log(`Server started on port ${port}`);
    //or we can write 
    //console.log('Sever started on port'+port); 
});