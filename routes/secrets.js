const express = require('express');
const cookieparser  = require('cookie-parser');
const router = express.Router();
const auth = require("../middleware/auth")
const app = express();
app.use(cookieparser());



router.get('/',auth,function(req,res)
{
    res.render("secrets"); 
    //res.sendFile(__dirname + '/index.html');
});

module.exports = router;