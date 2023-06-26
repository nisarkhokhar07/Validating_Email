const express = require("express");
const importRoute = require("./src/routes/importRoute");
const exportRoute = require("./src/routes/exportRoute");
const app = express();

app.use("/", importRoute);
app.use("/", exportRoute);
app.use("/testapi", (req, resp) => {
  resp.send("HELLO TEST API WORKING");
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
