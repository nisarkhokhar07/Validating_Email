const { emailresponses } = require("../models/emailresponse");

/**
 * It will send data to the database
 * @author Nisar Khokhar
 * @param {*} data
 */

const pushdatatoDatabase = async (data) => {
  console.log("Entered Database Function");

  try {
    await emailresponses
      .bulkCreate(
        data.map((value) => ({
          Email: value.Email,
          Valid: value.Valid,
          Reason: value.R,
          Typo: value.T,
          Smtp: value.S,
          Regex: value.RE,
          Disposible: value.D,
          Mx: value.M,
        }))
      )
      .then(() => console.log("created Database"));
    console.log("Column data inserted into the database successfully");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = pushdatatoDatabase;
