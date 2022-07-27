const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
//const mdb = require("../database/msgdb");
const express = require('express');
const app = express();
const flash = require('connect-flash');
app.use(flash());

const msgschema = mongoose.Schema({
    date:String,
    msg:[{room:String,name:String,data:String,time:String}]
});
const msgmodel = mongoose.model('msgmodel',msgschema,'msgs');
module.exports = msgmodel;
