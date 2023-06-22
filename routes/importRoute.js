const express = require("express");
const multer = require("multer");
const path = require("path");
const importController = require("../controllers/importController");

const router = express.Router();

// router.use(express.static(path.resolve("./public")));

//made a local storage using multer syorage engine where uploaded files will be saved
//we make a public directory and inside that make the uploads folder
//where the uploaded file will be saved with the name of filetoprocess.csv
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, "filetoprocess.csv");
  },
});

//we use that storage path or other functionalities of it in a variable
const upload = multer({ storage: storage });

//when we pass upload.single("file") middlware in our router the uploaded file's field name have to be file
//it also sends a file.path file.originalname and some other functionalities in a request object
router.post("/", upload.single("file"), importController.importUser);

module.exports = router;
