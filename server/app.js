const express = require("express");
const importRoute = require("../routes/importRoute");
const testRoute = require("../routes/testRoute");
const exportRoute = require("../routes/exportRoute");
const app = express();

app.use("/importfile", importRoute);
app.use("/exportfile", exportRoute);
app.use("/testapi", testRoute);

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
