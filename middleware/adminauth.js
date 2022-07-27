const jwt = require('jsonwebtoken');
const usermodel = require("../models/user");

const auth_admin = async function(req,res,next)
{
    try
    {
        //getting token stored in cookies
        const token = req.cookies.auth;
        //verify token
        const secretKey = "01234567890123456789012345678901";
        const verifyuser = jwt.verify(token,secretKey);     
        //verify id to database id
        const user = await usermodel.findOne({_id:verifyuser._id});
        //creating condition to check user is admin or not
        if(user.admin === false)
        {   
            //if user is not admin than display this message
            res.send("you are not authorized to access page");
            
        }
        else
        {
            req.token = token;
            req.user = user;
            next();
        }
        
    }
    catch(err)
    {
        //res.redirect("login");
        //console.log("err");
        console.log("err");
        
        
    }
}

module.exports = auth_admin;