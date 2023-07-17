const XLSX = require("xlsx");
const fs = require("fs");

const pushdatatoDatabase = require("./pushdatatodb");
const appendcolumn = require("./appendcolumn");
const validatEmail = require("./validatEmail");

const processxlsxfile = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  // Getting the range of the worksheet
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  // Getting the cell values of the first row (headers)
  const headers = [];

  const result1 = await new Promise(async function (resolve, reject) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: range.s.r, c: C });
      const cell = worksheet[address];
      headers.push(cell.v);
    }
    if (headers.includes("Email" || "email")) {
      //validating data for file to append new column of Valid
      const JsonData = XLSX.utils.sheet_to_json(worksheet);
      const validatedData = await validatEmail(JsonData);

      const dataforfile = validatedData.map((item) => {
        const { T, D, RE, R, M, S, ...rest } = item;
        return rest;
      });
      //sending data to database
      await pushdatatoDatabase(validatedData);
      //updating file with new valid column
      appendcolumn(dataforfile, filePath);

      resolve({
        status: 200,
        message: "Done with file update and pushing data to database",
      });
    } else {
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
    }
  });

  return result1;
};

module.exports = processxlsxfile;
