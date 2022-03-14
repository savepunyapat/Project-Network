const express = require("express")
const router = express.Router();
const controllers = require("../controllers/todo");

router.get("/todo", controllers.getTodo);

module.exports = router;