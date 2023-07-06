const express = require("express");
const handleRoutes = require("./src/handleRoutes");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();

app.use(cors());

app.use("/", handleRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`server has started on port ${process.env.PORT || 5000}`);
});
