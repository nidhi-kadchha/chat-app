const express = require('express');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const usermodel = require("../models/user");
const app = express();
app.use(cookieparser());

const auth = async function(req,res,next)
{
    try
    {
        const secretKey = "01234567890123456789012345678901";
        const token = req.cookies.auth;
        const verifyuser = jwt.verify(token,secretKey);
        const user = await usermodel.findOne({_id:verifyuser._id});
        req.token = token;
        req.user = user;
        
        next();
    }
    catch(err)
    {
        res.redirect("login");  
    }

}
module.exports = auth;