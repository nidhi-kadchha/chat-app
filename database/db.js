const mongoose = require('mongoose');



mongoose.connect("mongodb://localhost:27017/chatapp",function(err)
{
    if(err)
    {
        console.log("connection error : " + err);
    }
    else
    {
        console.log("database connected successfull");
    }
});


const db = mongoose.connect;
module.exports = db;