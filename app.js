const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//DB config

const db = require('./config/keys').MongoURI;

//connect to mongo

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err))

//EJS

app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser

app.use(express.urlencoded({ extended:false }));

//sessions

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))


//router

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT,console.log(`Server started on port ${PORT}`));
 