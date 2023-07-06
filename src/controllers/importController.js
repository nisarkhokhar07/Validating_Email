const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");
const { Parser } = require("json2csv");

const pushdatatoDatabase = require("../services/pushdatatodb");
const validatefordb = require("../services/validatefordb");
const validatedata = require("../services/validateforfile");
const appendcolumn = require("../services/appendcolumn");
const writetofile = require("../services/writefile");

/**
 * @author Nisar Khokhar
 * @param {*} req
 * @param {*} res
 */
const importUser = async (req, res) => {
  const filePath = req.file.path;
  console.log(filePath);
  const fileExtension = path.extname(filePath);

  if (fileExtension === ".xlsx") {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    const firstSheetName = sheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // Getting the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    // Getting the cell values of the first row (headers)
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[address];
      headers.push(cell.v);
    }
    if (headers.includes("Email" || "email")) {
      //validating data for file to append new column of valid
      const JsonData = XLSX.utils.sheet_to_json(worksheet);
      const validatedData = await validatedata(JsonData);
      //sending data to database
      const JsonDataforDb = XLSX.utils.sheet_to_json(worksheet);
      const validatedDataforDb = await validatefordb(JsonDataforDb);
      pushdatatoDatabase(validatedDataforDb);
      //updating file with new valid column
      appendcolumn(validatedData, filePath);
      res.status(200).send({
        message: "Done with file update and pushing data to database",
      });
    } else {
      res.status(400).send({ message: "File does not contain Email column" });
    }
  } else if (fileExtension === ".csv") {
    // const filepath = req.file.path;
    const filestream = fs.createReadStream(filePath);

    const processedData = [];
    const processedDataforDb = [];

    filestream
      .pipe(csvParser())
      .on("headers", (headers) => {
        //check if the Email or email header exists in file or not
        const emailcolumnexists = headers.includes("Email" || "email");
        //if it does not exist destroy the readstream functions and send the response back
        if (!emailcolumnexists) {
          res.status(404).send({ message: "Email Column does not exist" });
          filestream.destroy();
          return;
        }
      })
      .on("data", async (row) => {
        //push the data to the array row wise which will make the array of objects
        processedData.push(row);
        processedDataforDb.push({ Email: row.Email || row.email });
      })
      .on("end", async () => {
        //we initialize csvparser here
        const CsvParse = new Parser();

        //validate data for file to be downloaded
        const validatedData = await validatedata(processedData);
        //the csvparser reads and writes data in the csv format
        const CsvData = CsvParse.parse(validatedData);
        //write to the original file present in multer storage engine
        writetofile(CsvData, filePath);

        //validate data for database as it contains more columns than the data validated for file
        const validatedDataforDb = await validatefordb(processedDataforDb);

        //push data to the database
        pushdatatoDatabase(validatedDataforDb);

        res.send({ status: 200, success: true, message: "done" });
      })
      .on("error", (error) => {
        res
          .status(500)
          .send({ message: "Error occured while processing the csv file" });
      });
  } else {
    res.status(400).send({ message: "File format unsupported" });
    fs.unlink(filePath, (err) => {
      if (!err) {
        console.log(
          "file deleted successfully of unsupported format from server"
        );
      } else {
        console.log(`Error deleting file ${err.message}`);
      }
    });
  }
};

module.exports = {
  importUser,
};
