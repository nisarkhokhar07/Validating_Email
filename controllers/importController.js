const fs = require("fs");
const csvParser = require("csv-parser");
const { Parser } = require("json2csv");

//placed the functions in the services directory and imported them here
const validateemails = require("../services/validateemails");
const writetofile = require("../services/writefile");
const validatefordb = require("../services/validateForDb");
const pushdatatoDatabase = require("../services/pushdatatodb");

const importUser = async (req, res) => {
  try {
    //req.file.path will contain the path where the file is stored in multer storage engine
    const filepath = req.file.path;
    const filestream = fs.createReadStream(filepath);
    //initiate empty arrays where specific data is to be pushed
    const processedData = [];
    const processedDataforDb = [];

    filestream
      .pipe(csvParser())
      .on("headers", (headers) => {
        //check if the Email or email header exists in file or not
        const emailcolumnexists = headers.includes("Email" || "email");
        //if it does not exist destroy the readstream functions and send the response back
        if (!emailcolumnexists) {
          res.status(400).send("Email Column does not exists");
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
        const validatedData = await validateemails(processedData);
        //the csvparser reads and writes data in the csv format
        const CsvData = CsvParse.parse(validatedData);
        //write to the original file present in multer storage engine
        writetofile(CsvData, filepath);
        //validate data for database as it contains more columns than the data validated for file
        const validatedDataforDb = await validatefordb(processedDataforDb);
        //push data to the database
        pushdatatoDatabase(validatedDataforDb);

        res.send({ status: 200, success: true, msg: "done" });
      })
      .on("error", (error) => {
        res.status(500).send("Error occured while processing the csv file");
      });
  } catch (error) {
    res.send("Error while importing file");
  }
};

module.exports = {
  importUser,
};
