var express = require('express');
var router = express.Router();
var passport = require("passport");
const localStrategy = require("passport-local");
const upload = require('../utils/multer');
const user = require("../models/usermodel")
const postModel = require("../models/postmodel");
const postmodel = require("../models/postmodel");

passport.use(new localStrategy(user.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/profile', isLoggedIn ,async function(req, res, next) {
  const user1 = await user
         .findOne({username : req.session.passport.user})
         .populate("posts")
  // const posts = await postModel.findOne()       
  res.render('profile', {user : user1});
});

router.post('/fileupload', isLoggedIn , upload.single("image") , async function(req, res, next) {
  // res.send('uploaded');
  const user1 = await user.findOne({username : req.session.passport.user})
  user1.profileImage = req.file.filename;
  await user1.save();
  res.redirect("/profile");

});


router.get('/addnewpost', isLoggedIn ,async function(req, res, next) {
  const user1 = await user.findOne({username : req.session.passport.user})
 res.render('addnewpost', {user : user1});
});

router.post('/createPost', isLoggedIn, upload.single("postImage") ,async function(req, res, next) {
  const user1 = await user.findOne({username : req.session.passport.user})
  const post = await postModel.create({
    user : user._id,
    postImage : req.file.filename,
    postTitle : req.body.postTitle,
    postDescription : req.body.postDescription
  })
  user1.posts.push(post._id);
  await user1.save()
  res.redirect("/profile");
});

router.get('/addnewpost', isLoggedIn ,async function(req, res, next) {
  const user1 = await user.findOne({username : req.session.passport.user})
  res.render('addnewpost', {user : user1});
});

router.get('/show/posts', isLoggedIn ,async function(req, res, next) {
  const user1 = await user
         .findOne({username : req.session.passport.user})
         .populate("posts")
  res.render('show', {user : user1});
});

router.get('/feed', isLoggedIn ,async function(req, res, next) {
  const user1 = await user.findOne({username : req.session.passport.user})
  const posts = await postModel.find()
  .populate("user")
         
  res.render('feed', {user : user1, posts : posts});
});

router.get('/edit',isLoggedIn, async function(req, res, next) {
  try{
    const user2 = await user.findOne(req.body);
    res.render( "edit" , { user: user2 });
  }
  catch(err){
    console.log(err);
  }
});

router.post("/userUpdated", isLoggedIn, async function(req, res, next){
 res.send("hyyy") 

})

router.post('/register', async function(req, res, next) {
  const user1 = new user({
    username : req.body.username,
    fullname : req.body.fullname,
    email : req.body.email,
    contact : req.body.contact,   
  })

  user.register(user1, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/");
    })
  })
});


router.post("/login", passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect : "/register"
}) , function(req, res) {

});

//logout
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});


//middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
