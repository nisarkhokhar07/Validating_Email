const path = require("path");
const XLSX = require("xlsx");

/**
 * This will update the existing worksheet
 * @author Nisar Khokhar
 * @param {*} validatedData
 */

const appendcolumn = (validatedData, filePath) => {
  try {
    const newworkbook = XLSX.utils.book_new();
    const newworksheet = XLSX.utils.json_to_sheet(validatedData);
    XLSX.utils.book_append_sheet(newworkbook, newworksheet, "updatedSheet");
    XLSX.writeFile(newworkbook, filePath);
  } catch (error) {
    console.log("Error while updating XLSX file: " + error.message);
  }
};

module.exports = appendcolumn;
