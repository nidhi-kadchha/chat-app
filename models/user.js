const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const db = require("../database/db");
const express = require('express');
const app = express();
const flash = require('connect-flash');
app.use(flash());
/*

const userschema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"required" ],
        unique:true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"too short"]       
    },
    role:{
        type:String,
        required:true,
        enum:['user','admin']
        
    },
    admin:{
        type:Boolean
    }
})
*/
const userschema = mongoose.Schema({
    username:{
            type:String,
            required:[true,'c n e'],
            
            
    },
    name:{type:String},
    password:{
        type:String,
        required:true,
        
    },
    role:String,
    admin:Boolean,
    tokens:[{token:{type:String}}]
});
//creating token
userschema.methods.genrateauthtoken = async function()
{
    try
    {
        const secretKey = "01234567890123456789012345678901";
        const newtoken = jwt.sign({_id:this._id.toString()},secretKey);
        
        this.tokens = this.tokens.concat({token:newtoken})
        await this.save();
        return newtoken;
    
    }
    catch(err)
    {
        console.log(err);
    }
}

const usermodel = mongoose.model('usermodel',userschema,'user');
module.exports = usermodel;