const express = require("express")
const router = express.Router();
const controllers = require("../controllers/dashboard");

router.get("/dashboard", controllers.getDashboard);

module.exports = router;