const fs = require("fs");
const csvParser = require("csv-parser");
const { Parser } = require("json2csv");

const pushdatatoDatabase = require("./pushdatatodb");
const validatefordb = require("./validatefordb");
const validatedata = require("./validateforfile");
const writetofile = require("./writefile");

const processcsvfile = async (filePath) => {
  const filestream = fs.createReadStream(filePath);
  const processedData = [];
  const processedDataforDb = [];

  const result1 = await new Promise(function (resolve, reject) {
    filestream
      .pipe(csvParser())
      .on("headers", (headers) => {
        //check if the Email or email header exists in file or not
        const emailcolumnexists = headers.includes("Email" || "email");
        //if it does not exist destroy the readstream functions and send the response back
        if (!emailcolumnexists) {
          fs.unlink(filePath, (err) => {
            if (!err) {
              console.log("This file does not have email column");
            } else {
              console.log(`Error deleting file ${err.message} from server`);
            }
          });
          reject({
            status: 400,
            message: "File does not contain Email column",
          });
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
        console.log(3);
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
        await pushdatatoDatabase(validatedDataforDb);
        resolve({
          status: 200,
          success: true,
          message: "Done with file update and pushing data to the database",
        });
      })
      .on("error", (error) => {
        reject({
          status: 500,
          message: "Error occurred while processing the CSV file",
        });
      });
  });

  return result1;
};

module.exports = processcsvfile;
