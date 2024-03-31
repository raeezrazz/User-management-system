
const express = require('express');

const user_route = express();
const session = require("express-session");

const config = require("../config/config.js")

user_route.use(session({secret:config.sessionSecret}))

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser = require('body-parser')
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth.js')


const multer= require("multer") ;

const path = require('path')

user_route.use(express.static('public'));

// const bodyParse = require("body-parse")

const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname, '../public/userImages'));

    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});

const userController = require("../controllers/userController");

// user_route.get('/signup',auth.isLogout,userController.loadRegister);


user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser);

user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.get('/',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout)


// edit button
user_route.get('/edit',auth.isLogin,userController.editProfile);

// updated data
user_route.post('/edit',upload.single('image'),userController.updateProfile)

module.exports = user_route;