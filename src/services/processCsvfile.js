const fs = require("fs");
const csvParser = require("csv-parser");
const { Parser } = require("json2csv");

const pushdatatoDatabase = require("./pushdatatodb");
const writetofile = require("./writefile");
const validateData = require("./validatEmail");

const processcsvfile = async (filePath) => {
  const filestream = fs.createReadStream(filePath);
  const processedData = [];

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
      })
      .on("end", async () => {
        //we initialize csvparser here
        const CsvParse = new Parser();

        //validate data for file to be downloaded
        const validatedData = await validateData(processedData);
        const dataforfile = validatedData.map((item) => {
          const { T, D, RE, R, M, S, ...rest } = item;
          return rest;
        });
        //the csvparser reads and writes data in the csv format
        const CsvData = CsvParse.parse(dataforfile);

        //push data to the database
        await pushdatatoDatabase(validatedData);

        //write to the original file present in multer storage engine
        writetofile(CsvData, filePath);

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
