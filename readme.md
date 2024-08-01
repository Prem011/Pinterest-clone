login screen register
profile
pins
feed
save pin
Board creation
logout
protected routes

express
mongoose
multer
passport

/login and register screen
/register
/loginvar createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const expressSession  = require('express-session');
const passport = require('passport');

var app = express();


app.use(expressSession({
  resave : false,
  saveUninitialized : false,
  secret : "hello hello baaye baaye"
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
/profile - page with Board
/feed - feed page with all different pins
/save/:pinid - save kaarege pin ko kisi board m
/delete/:pinid - delete kaarege pin ko kisi board m
/logout

/edit
/upload


//passport
1. install passport packages
passport passport-local passport-local-mongoose express-session mongoose

2. plugin the schema with passport-local-mongoose
CODE:-
model.plugin(plm)

3. in app.js code the boilerplate
passport/express-session

CODE:-

const passport = require("passport");
const session = require("express-session");

const User = require("./models/usermodel");


app.use(
    session({
        saveUninitialized: true,
        resave: true,
        secret: "asdhbcfkjf",
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


4. in index.js use strategy

CODE: 
const User = require("../models/usermodel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));

---------------------------------------------------------------------------------------------------------

1. In order to change the 'username' default  field to let's say 'email'
Step 1: in model file 
model.plugin(plm, {usernameField: 'email'})

Step 2: in index.js we replace 
"passport.use(new LocalStrategy(User.authenticate()));"
to 
passport.use(User.createStrategy());
----------------------------------------------------------------------------------------------------------


SIGNUP CODE
router.post("/signup", async function (req, res, next) {
    try {
        await User.register(
            { username: req.body.username, email: req.body.email },
            req.body.password
        );
        res.redirect("/signin");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


SIGNIN CODE
router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
    }),
    function (req, res, next) {}
);


AUTHENTICATED ROUTE MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/signin");
    }
}


SIGNOUT CODE
router.get("/signout", isLoggedIn, function (req, res, next) {
    req.logout(() => {
        res.redirect("/signin");
    });
});


FORGET PASSWORD CODE
 try {
        const user = await User.findOne({ username: req.body.username });
        if (!user)
            return res.send("User not found! <a href='/forget'>Try Again</a>.");

        await user.setPassword(req.body.newpassword);
        await user.save();
        res.redirect("/signin");
    } catch (error) {
        res.send(error);
    }


RESET PASSWORD CODE
 try {
        await req.user.changePassword(
            req.body.oldpassword,
            req.body.newpassword
        );
        await req.user.save();
        res.redirect("/profile");
    } catch (error) {
        res.send(error);
    }
});