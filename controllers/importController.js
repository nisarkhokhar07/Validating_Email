const fs = require("fs");
const csvParser = require("csv-parser");
const validator = require("deep-email-validator");
const { Parser } = require("json2csv");
const path = require("path");

const writetofile = require("../services/writefile");
const pushdatatoDatabase = require("../services/pushdatatodb");

let CsvData;
let validatedDataforDb = [];

const importUser = async (req, res) => {
  const filepath = req.file.path;
  console.log(filepath);

  const filestream = fs.createReadStream(filepath);

  const processedData = [];
  const processedDataforDb = [];

  filestream
    .pipe(csvParser())
    .on("headers", (headers) => {
      const emailcolumnexists = headers.includes("Email" || "email");
      if (!emailcolumnexists) {
        res.status(400).send("Email Column does not exists");
        deletedownloadfile();
        filestream.destroy();
        return;
      }
    })
    .on("data", async (row) => {
      processedData.push(row);
      processedDataforDb.push({ Email: row.Email || row.email });
    })
    .on("end", async () => {
      const CsvParse = new Parser();
      let validatedData = [];

      while (processedData.length) {
        const data = processedData.splice(
          0,
          processedData.length > 50000 ? 50000 : processedData.length
        );
        const temp = await Promise.all(
          data.map(async (obj) => {
            const { valid, reason, validators } = await validator.validate(
              obj.Email || obj.email
            );

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
      CsvData = CsvParse.parse(validatedData);

      writetofile(CsvData, filepath);

      while (processedDataforDb.length) {
        const data = processedDataforDb.splice(
          0,
          processedDataforDb.length > 50000 ? 50000 : processedDataforDb.length
        );
        const temp = await Promise.all(
          data.map(async (item) => {
            const { valid, reason, validators } = await validator.validate(
              item.Email
            );
            item.Valid = valid;
            if (reason) {
              if (item.Email) {
                item.R = reason;
              } else {
                item.R = "No Email";
              }
            } else {
              item.R = "Valid Email";
            }
            item.T = validators.typo.valid;
            item.S = validators.smtp.valid;
            item.M = validators.mx.valid;
            item.D = validators.disposable.valid;
            item.RE = validators.regex.valid;
            return item;
          })
        );
        validatedDataforDb = [...validatedDataforDb, ...temp];
      }

      pushdatatoDatabase(validatedDataforDb);

      res.send({ status: 200, success: true, msg: "done" });
    })
    .on("error", (error) => {
      res.status(500).send("Error occured while processing the csv file");
    });
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
