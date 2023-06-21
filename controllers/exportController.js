const fs = require("fs");
const path = require("path");

const exportUser = async (req, res) => {
  try {
    const file = path.join(__dirname, "../public/uploads/fileprocessed.xlsx");
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
      res.send("No file exists now you have already downloaded it");
    }
  } catch (error) {
    res.send({ status: 400, success: false, msg: error.message });
  }
};

module.exports = { exportUser };
