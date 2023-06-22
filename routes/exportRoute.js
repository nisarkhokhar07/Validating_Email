const express = require("express");
const exportController = require("../controllers/exportController");

//create he router of the path
const router = express.Router();

router.get("/", exportController.exportUser);

module.exports = router;
