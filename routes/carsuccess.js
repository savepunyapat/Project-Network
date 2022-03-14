const express = require("express")
const router = express.Router();
const controllers = require("../controllers/carsuccess");

router.get("/carsuccess", controllers.getCarSucces);

module.exports = router;