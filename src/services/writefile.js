const fs = require("fs");

/**
 * This will write the data to the file whose path is provided in the dest
 * @author Nisar Khokhar
 * @param {*} data
 * @param {*} dest
 */

const writetofile = (data, dest) => {
  const writeablestream = fs.createWriteStream(dest);

  writeablestream.write(data);
  writeablestream.end();

  writeablestream.on("finish", () => {
    console.log("Done writing file");
  });
  writeablestream.on("error", () => {
    console.log("error writing file");
  });
};

module.exports = writetofile;
