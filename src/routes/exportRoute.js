const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");

router.get("/exportfile", exportController.exportUser);

module.exports = router;
