const fs = require("fs");
const path = require("path");

/**
 * This will export the xlsx file and make it available for download
 * @author Nisar Khokhar
 * @param {*} req
 * @param {*} res
 */
const exportUser = async (req, res) => {
  try {
    const filename = req.query.name;
    const file = path.resolve(`./public/uploads/${filename}`);
    if (fs.existsSync(file)) {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", 'attachment; filename="file.xlsx"');
      res.sendFile(file, () => {
        fs.unlink(file, (err) => {
          if (!err) {
            console.log("file deleted successfully");
          } else {
            console.log(`Error deleting file ${err.message}`);
          }
        });
      });
    } else {
      res.send(
        `No file with name ${req.query.name} exists now you have already downloaded it`
      );
    }
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = { exportUser };
