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
    const file = path.resolve(
      __dirname + `../../../public/uploads/${filename}`
    );
    const extension = filename.split(".").pop();

    if (extension === "xlsx") {
      if (fs.existsSync(file)) {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        res.sendFile(file, () => {
          fs.unlink(file, (err) => {
            if (!err) {
              console.log("File deleted successfully from server.");
            } else {
              console.log(`Error deleting file from server:  ${err.message}`);
            }
          });
        });
      } else {
        res
          .status(404)
          .send(
            `No file with name ${req.query.name} exists now you have already downloaded it`
          );
      }
    } else if (extension === "csv") {
      if (fs.existsSync(file)) {
        //headers are set to get the file downloaded in the specific format
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
        //this will send the reponse as a file
        res.sendFile(file, () => {
          fs.unlink(file, (err) => {
            if (!err) {
              console.log("File deleted successfully from server.");
            } else {
              console.log(`Error deleting file from server: ${err.message}`);
            }
          });
        });
      } else {
        res
          .status(404)
          .send("No file exists now, you have already downloaded it");
      }
    } else {
      res.status(404).send("No file exists of this format.");
    }
  } catch (error) {
    res.send({
      status: 404,
      success: false,
      message: "Error while downloading file: " + error.message,
    });
  }
};

module.exports = { exportUser };
