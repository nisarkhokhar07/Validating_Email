const express = require("express");
const multer = require("multer");
const path = require("path");
const importController = require("../controllers/importController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "../../../public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

console.log(path.resolve(__dirname + "../../../public/uploads"));

router.post("/", upload.single("file"), importController.importUser);

module.exports = router;
