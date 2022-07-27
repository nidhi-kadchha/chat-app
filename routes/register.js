const express = require('express');
const router = express.Router();
const usermodel = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const {check,validationResult} = require('express-validator');

const app = express();
app.use(flash());
app.use(check());


router.get('/', function(req,res)
{
    const flash = req.flash('errmsg');
    res.render("register",{flash});

});

router.post('/',
[
    check('username','please enter valid email-id').not().isEmpty().isEmail(),
    check("password","Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character. ",)
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),   
    check('role','enter valid role').isString()

]
,async (req,res,next) =>
{
    const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
           var msg,index,length;
           const errarray = errors.array();  
           length = errarray.length 
            for(i=0; i<length; i++)
            {
                index = errarray[i].value;
                msg = errarray[i].msg;
                req.flash('errmsg',msg);     
            }
           res.redirect("register");
           
        } 

else{
    const name = req.body.username;
    const n = req.body.name;
    const ps = req.body.password;
    const ro = req.body.role;

    usermodel.findOne({username:name},function(err,ouser)
    {
        
        if(err)
        {
            console.log(err);
        }
        else if(ouser)
        {
            console.log("user already exist");
        }
        else
        {
            try {
                var ad;
            if(ro === "admin"){ad=true;}
            else{ad=false;} 
            const salt = 10;
            let hash = bcrypt.hashSync(ps,salt)
            const newdata = usermodel({username:name,name:n,password:hash,role:ro,admin:ad});   
            newdata.save();
            res.render("secrets")
            

            } 
            catch (error) 
            {
                console.log(err);
            }
            
              
            //const token = newdata.genrateauthtoken();
            
        }
    })
}})

module.exports = router;