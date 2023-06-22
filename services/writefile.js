const fs = require("fs");

/**
 * It will write the csv data to the file destination provided as a dest param
 * @param {*} data
 * @param {*} dest
 * @author Nisar Khokhar
 */
const writetofile = (data, dest) => {
  try {
    const writeablestream = fs.createWriteStream(dest);

    writeablestream.write(data);
    writeablestream.end();

    writeablestream.on("finish", () => {
      console.log("Done writing file");
    });
    writeablestream.on("error", () => {
      console.log("error writing file");
    });
  } catch (error) {
    console.log("Error while writing file");
  }
};

module.exports = writetofile;
