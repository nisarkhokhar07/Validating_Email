const fs = require("fs");
const path = require("path");

const exportUser = async (req, res) => {
  try {
    //resolve the path to file which has to be exported
    //as we know the path and named it according to ourselves so we can access this
    //we renamed the uploaded file while getting it uploaded
    const file = path.join(__dirname, "../public/uploads/filetoprocess.csv");
    if (fs.existsSync(file)) {
      //headers are set to get the file downloaded in the specific format
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="file.csv"');
      //this will send the reponse as a file
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
      res.send("No file exists now you have already downloaded it");
    }
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = { exportUser };
