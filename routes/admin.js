const express = require('express');
const router = express.Router();
const auth_admin = require("../middleware/adminauth")


router.get('/',auth_admin,function(req,res)
{
    res.render("admin");
});

module.exports = router;