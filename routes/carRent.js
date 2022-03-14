const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const controllers = require("../controllers/carRent");
router.get("/carRent", controllers.getCarRent);


module.exports = router;