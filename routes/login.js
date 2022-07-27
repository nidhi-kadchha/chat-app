const express = require('express');
//const cookieparser = require('cookie-parser');
const router = express.Router();
const jwt = require('jsonwebtoken');
const usermodel = require("../models/user");
const auth = require("../middleware/auth");
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const {check,validationResult} = require('express-validator');

const app = express();
app.use(flash());
app.use(check());
router.get('/',function(req,res)
{
    res.render("login",{});
});


router.post('/',
/*[
    check('username','invalid email').isEmail(),
    check('username','email is required').not().isEmpty(),
    check("password","Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ",)
        .isLength({ min: 8 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
    check('role','enter valid role').isString()

],*/
function(req,res)
{/*
    const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            return res.status(422).json({ errors: errors.array() });
            //req.flash('message',`${errors}`)
            //console.log("here");
            //res.render("register")
        }*/
    const name = req.body.username;
    const ps = req.body.password;
    const ro = req.body.role;
    
    usermodel.findOne({username:name},async function(err,user)
    {
        if(err)
        {
            console.log(err);
        }
        else if(user)
        {
           
            bcrypt.compare(ps,user.password,async function(err,result)
            {
                if(err){console.log(err);}
                else if(result)
                {
                    usermodel.findOne({role:ro},async function(err,authuser)
                    {
                        if(err){console.log(err);}
                        else if(authuser)
                        {
                            //calling token creating function from models
                            const token = authuser.genrateauthtoken();
                            //sending token data and storing in cookies
                            res.cookie("auth",token,{maxAge:9000000,httpOnly:true});                          
                            res.render("secrets")
                        }
                        else{console.log("invalid role");}
                    })
                }
                else
                {
                    console.log("invalid");
                }
            })
                    
        }
        else
        {
            console.log("No such user Exist");
        }
    })
})
module.exports = router;