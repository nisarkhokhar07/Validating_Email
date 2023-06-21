const path = require("path");
const XLSX = require("xlsx");

const appendcolumn = (validatedData) => {
  console.log("appending column");
  const newworkbook = XLSX.utils.book_new();
  const newworksheet = XLSX.utils.json_to_sheet(validatedData);
  XLSX.utils.book_append_sheet(newworkbook, newworksheet, "updatedSheet");
  const filePath = path.join(__dirname, "../public/uploads/fileprocessed.xlsx");
  XLSX.writeFile(newworkbook, filePath);
};

module.exports = appendcolumn;
