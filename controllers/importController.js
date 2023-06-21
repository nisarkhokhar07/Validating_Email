const fs = require("fs");
const validator = require("deep-email-validator");
const path = require("path");
const XLSX = require("xlsx");

const writetofile = require("../services/writefile");
const pushdatatoDatabase = require("../services/pushdatatodb");

const importUser = async (req, res) => {
  const filePath = req.file.path;

  const workbook = XLSX.readFile(filePath);

  const sheetNames = workbook.SheetNames;

  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const JsonData = XLSX.utils.sheet_to_json(worksheet);

  console.log(typeof JsonData);

  console.log(JsonData.length);
  let validatedData = [];

  while (JsonData.length) {
    const data = JsonData.splice(
      0,
      JsonData.length > 50000 ? 50000 : JsonData.length
    );
    console.log(data.length);
    const temp = await Promise.all(
      data.map(async (obj) => {
        const { valid } = await validator.validate(obj.Email);

        if (valid) {
          obj.Valid = 1;
        } else {
          obj.Valid = 0;
        }

        return obj;
      })
    );
    validatedData = [...validatedData, ...temp];
  }

  const newworkbook = XLSX.utils.book_new();
  const newworksheet = XLSX.utils.json_to_sheet(validatedData);

  XLSX.utils.book_append_sheet(newworkbook, newworksheet, "updatedSheet");

  XLSX.writeFile(newworkbook, filePath);

  res.status(200).send("Updated file");
};

const exportUser = async (req, res) => {
  try {
    const file = path.join(__dirname, "../public/uploads/filetoprocess.csv");
    if (fs.existsSync(file)) {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="file.csv"');
      res.sendFile(file, () => {
        fs.unlink(file, (err) => {
          if (!err) {
            console.log("file deleted successfully");
          } else {
            console.log(`Error deleting file ${err.message}`);
          }
        });
      });
    } else {
      res.send("No file exists now you have already downloaded it");
    }
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = {
  importUser,
  exportUser,
};
