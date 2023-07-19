const path = require("path");
const fs = require("fs");

const processcsvfile = require("../services/processCsvfile");
const processxlsxfile = require("../services/processxlsxfile");

/**
 * @author Nisar Khokhar
 * @param {*} req
 * @param {*} res
 */
const importUser = (req, res) => {
  console.log(req.file, "this is request file --------");
  const filePath = req.file.path;
  console.log(filePath);
  const fileExtension = path.extname(filePath);

  if (fileExtension === ".xlsx") {
    processxlsxfile(filePath)
      .then((value) => {
        res.send(value);
      })
      .catch((error) => {
        res.send(error);
      });
  } else if (fileExtension === ".csv") {
    processcsvfile(filePath)
      .then((value) => {
        res.send(value);
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.status(400).send({ message: "File format unsupported" });
    fs.unlink(filePath, (err) => {
      if (!err) {
        console.log("This format is unsupported");
      } else {
        console.log(`Error deleting file ${err.message} from server`);
      }
    });
  }
};

module.exports = {
  importUser,
};
