const express = require("express");
const router = express.Router();
const controllers = require("../controllers/carcon1");
const { check ,validationResult, body} = require('express-validator');
const mongoose = require('mongoose');
const app = express;

var date = new Date();

var date = new Date();

var year = date.getFullYear();
var day = date.getDate();
var month = date.getMonth();
month = month+1;
datetime = month + "/" + day + "/" + year;


mongoose.connect("mongodb+srv://save1412:save1412@cluster0.avz4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
  console.log(":: Connected from Carcon1");
});
const carSchema ={
    rname:String,
    rlastname:String,
    rpnumber:String,
    rprice:Number,
    rBrand:String,
    rSignDate:String,
    rGetDate:String
}

const carRent = mongoose.model("carRent",carSchema)

router.get("/carcon1", controllers.getCarCon1);

router.post("/carcon1",
    body("fname").not().isEmpty(),
    body("lname").not().isEmpty(),
    body("pnumber").not().isEmpty(),
    body("carbrand").not().isEmpty(),
    body("datepicker").not().isEmpty()
,function(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.redirect("/alert")
    }else{
        let newRent = new carRent({
            rname: req.body.fname,
            rlastname: req.body.lname,
            rpnumber: req.body.pnumber,
            rBrand: req.body.carbrand,
            rGetDate: req.body.datepicker,
            rSignDate: datetime
        });
        newRent.save();
        res.redirect("/carsuccess")
    }
    /*
    console.log(req.body.fname);
    console.log(req.body.lname);
    console.log(req.body.pnumber);
    console.log(req.body.datepick);*/
});

module.exports = router;