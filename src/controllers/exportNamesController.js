const path = require("path");
const fs = require("fs");

const exportnames = (req, resp) => {
  const directoryPath = path.join(__dirname, "../../public/uploads");
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    const filenames = [];
    files.forEach(function (file) {
      filenames.push(file);
    });

    resp.json(filenames);
  });
};

module.exports = exportnames;
