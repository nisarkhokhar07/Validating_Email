const XLSX = require("xlsx");

const pushdatatoDatabase = require("../services/pushdatatodb");
const validatefordb = require("../services/validatefordb");
const validatedata = require("../services/validateforfile");
const appendcolumn = require("../services/appendcolumn");

const importUser = async (req, res) => {
  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  //validating data for file to append new column of valid
  const JsonData = XLSX.utils.sheet_to_json(worksheet);
  const validatedData = await validatedata(JsonData);

  //sending data to database
  const JsonDataforDb = XLSX.utils.sheet_to_json(worksheet);
  const validatedDataforDb = await validatefordb(JsonDataforDb);
  pushdatatoDatabase(validatedDataforDb);

  //updating file with new valid column
  appendcolumn(validatedData);

  res.status(200).send("Done with file update and pushing data to database");
};

module.exports = {
  importUser,
};
