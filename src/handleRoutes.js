const express = require("express");
const importRoute = require("./routes/importRoute");
const exportRoute = require("./routes/exportRoute");
const filenamesRoute = require("./routes/filenamesRoute");

const app = express();

app.use("/importfile", importRoute);
app.use("/exportfile", exportRoute);
app.use("/filenames", filenamesRoute);

module.exports = app;
