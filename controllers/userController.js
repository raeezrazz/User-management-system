const userModels = require('../models/userModels');
const User = require('../models/userModels');
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{
        try {
            
          const passwordHash = await  bcrypt.hash(password,10);
            return passwordHash; 

        } catch (error) {
            console.log(error.message);
        }
}

const loadRegister = async(req,res)=>{
    try{
  
        res.render('registration');

    } catch(error){
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    const email=req.body.email
    
    try{
        const spassword =  await securePassword(req.body.password);
        const nameValidation = /^[^\s]+$/;
        if (!nameValidation.test(req.body.name)) {
            return res.render('registration', { message: 'Invalid name format. Please enter a valid name.' });
        }

        const user = new User({
    name:req.body.name,
    email:req.body.email,
    mobile:req.body.mno,
    image:req.file.filename,
    password: spassword,
    is_admin:0

    

   });
   const heyy= await User.find({email})
   if(heyy.length){
    res.render('registration',{message:"email already exist"})
   }


       const userData =await user.save();
       if(userData){
        res.render('registration',{message:"Your registration has been successfull, "})
       }else{
        res.render('registration',{message:"Your registration has been failed"})
       }


    } catch(error){
        console.log(error.message);
    }
}


// Login user methode started

const loginLoad = async(req,res)=>{
    try {

        res.render('login')
        
    } catch (error) {
        console.log(error.message);
}
}

const verifyLogin = async(req,res)=>{

    try {
        console.log('etheetund');

        const email = req.body.email;
        const password= req.body.password;


        const userData = await User.findOne({email:email});
      
        
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                if (userData.is_Verified === 0) {
                    res.render('login',{message:"Please verify your mail."});
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            } else { 
                res.render('login',{message:"Email and password are Incorrect"})
            }

        }else{
            res.render('login',{message:"Email and password are Incorrect"});
        }

    }catch(error){

        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{

    try {

       const userData = await  User.findById({_id:req.session.user_id})
       
        res.render('home',{user:userData});
    
    } catch (error) {
        
        console.log(error.message);
    }

}

const userLogout = async(req,res)=>{

    try {
        console.log("ivide ethi  23456789");
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }
} 

// user profile edit and update

const editProfile = async(req,res)=>{

    try {

        const id = req.query.id;

       const userData = await User.findById({_id:id})
        if(userData){
            res.render('edit',{user:userData})
        }else{
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error.message);
    }
}

// profile update 
const updateProfile = async(req,res)=>{
    try {
        if(req.file){
            

            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}})
        }else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})
            
        }
        res.redirect('/home');
        
    } catch (error) {
      console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editProfile,
    updateProfile

}