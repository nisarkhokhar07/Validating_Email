const express = require("express");
const exportNamesController = require("../controllers/exportNamesController");

const router = express.Router();

router.get("/", exportNamesController);

module.exports = router;
