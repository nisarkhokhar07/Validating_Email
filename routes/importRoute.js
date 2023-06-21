const express = require("express");
const multer = require("multer");
const path = require("path");
const importController = require("../controllers/importController");

const router = express.Router();

router.use(express.static(path.resolve("./public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, "filetoprocess.csv");
  },
});

const upload = multer({ storage: storage });

router.post("/importfile", upload.single("file"), importController.importUser);

router.get("/exportfile", importController.exportUser);

module.exports = router;
