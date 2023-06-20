const fs = require("fs");
const csvParser = require("csv-parser");
const validator = require("deep-email-validator");
const { Parser } = require("json2csv");
let { emailresponse } = require("../models/emailresponse");
const path = require("path");
let CsvData;

const importUser = async (req, res) => {
  const filepath = req.file.path;
  console.log(filepath);
  const dest = req.file.destination;
  console.log(dest);
  const pathdest = path.join(dest + "/updatedfile.csv");
  console.log(pathdest);

  const filestream = fs.createReadStream(filepath);

  const writeablestream = fs.createWriteStream(pathdest);
  const processedData = [];
  const processedDataforDb = [];

  const deletedownloadfile = () => {
    const file = path.join(__dirname, "../public/uploads/downloadedfile.csv");
    // console.log(file);
    if (file) {
      fs.unlink(file, (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("file deleted");
        }
      });
    }
  };

  const deleteupdatefile = () => {
    const updatedfile = path.join(
      __dirname,
      "../public/uploads/updatedfile.csv"
    );
    if (updatedfile) {
      fs.unlink(updatedfile, (err) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("updated file deleted");
        }
      });
    } else {
      console.log("updated file does not exists");
    }
  };

  filestream
    .pipe(csvParser())
    .on("headers", (headers) => {
      const emailcolumnexists = headers.includes("Email" || "email");
      if (!emailcolumnexists) {
        res.send("Column does not exists");
        deletedownloadfile();
        deleteupdatefile();
        filestream.destroy();
      }
    })
    .on("data", async (row) => {
      processedData.push(row);
      processedDataforDb.push({ Email: row.Email || row.email });
      //changing
    })
    .on("end", async () => {
      const CsvParse = new Parser();
      // console.log(processedData.length);
      let validatedData = [];

      while (processedData.length) {
        const data = processedData.splice(
          0,
          processedData.length > 50000 ? 50000 : processedData.length
        );
        // console.count(2);
        const temp = await Promise.all(
          data.map(async (obj) => {
            const { valid, reason, validators } = await validator.validate(
              obj.Email || obj.email
              //changing
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

      writeablestream.write(CsvData);
      writeablestream.end();

      writeablestream.on("finish", () => {
        console.log("Done writing file");
      });
      writeablestream.on("error", () => {
        console.log("error writing file");
      });

      // console.log(processedDataforDb.length);

      let validatedDataforDb = [];

      while (processedDataforDb.length) {
        const data = processedDataforDb.splice(
          0,
          processedDataforDb.length > 50000 ? 50000 : processedDataforDb.length
        );
        // console.count(3);
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

      const pushdatatoDatabase = async (data) => {
        console.log("Entered Database Function");
        try {
          await emailresponse
            .bulkCreate(
              data.map((value) => ({
                Email: value.Email,
                Valid: value.Valid,
                Reason: value.R,
                Typo: value.T,
                Smtp: value.S,
                Regex: value.RE,
                Disposible: value.D,
                Mx: value.M,
              }))
            )
            .then(() => console.log("created Database"));
          console.log("Column data inserted into the database successfully");
        } catch (error) {
          console.error(error.message);
        }
      };

      pushdatatoDatabase(validatedDataforDb);

      res.send({ status: 200, success: true, msg: "done" });
    })
    .on("error", (error) => {
      res.status(500).send("Error occured while processing the csv file");
    });
};

const exportUser = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment: filename = validatedData.csv"
    );

    deletedownloadfile();
    deleteupdatefile();
    res.status(200).end(CsvData);
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = {
  importUser,
  exportUser,
};
