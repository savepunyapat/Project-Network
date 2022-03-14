const express = require("express");
const router = express.Router();
const controllers = require("../controllers/alert");
router.get("/alert", controllers.getAlert);


module.exports = router;