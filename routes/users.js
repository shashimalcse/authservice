const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const router = express.Router();

const User = require('../models/User');
require('../config/passport');

router.get('/login', (req, res) =>
    res.render('login'));

router.get('/register', (req, res) =>
    res.render('register'));


router.post('/register',async (req,res)=>{
    const {name,email,password,password2} = req.body;
    let errors =[];

    if(!name || !email || !password || !password2){
        errors.push({msg:'Please fill in all fields'});
    }

    if(password !== password2){
        errors.push({msg:'Passwords do not match'});
    }

    if(password.length <6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    if(errors.length >0){
        res.render('register',{
            errors,
            name,email,password,password2
        });

    }
    else{
        User.findOne({
            email:email
        }).then(user =>{
            if(user){
                //user exist
                errors.push({ msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,email,password,password2
                });
            }
            else{
                 const newUser = new User({
                     name,email,password
                 });

                 //Hashing

                 bcrypt.genSalt(10, async (err,salt)=> bcrypt.hash(newUser.password,salt,async (err,hash)=>{
                                                    if(err) throw err;
                                                    newUser.password=hash;
                                                    await newUser.save()
                                                        .then(user => {
                                                            res.redirect('./users/login');
                                                        })
                                                        .catch(err =>console.log(err));
                 }));


            }
        }).catch(err=> console.log(err));
    }

});

//Login Handle

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
    })(req,res,next);

});


router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/users/login');
})

module.exports = router;