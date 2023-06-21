const express = require("express");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");

const router = express();

router.use(express.static(path.resolve("./public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, "filetoprocess.xlsx");
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  const xlsxFilePath = path.join(
    __dirname,
    "./public/uploads/filetoprocess.xlsx"
  );
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const csvData = XLSX.utils.sheet_to_csv(worksheet);

  // const workbook = XLSX.readFile(xlsxFilePath);
  // const worksheet = workbook.Sheets[sheetName];
  // const csvData = XLSX.utils.sheet_to_csv();
});

module.exports = router;
