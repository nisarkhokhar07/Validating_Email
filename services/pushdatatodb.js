//have the database's variable
const { emailresponses } = require("../models/emailresponse");

/**
 * function which push specific data to the specific column of db,
 * data argument of function is an array of objects
 * @param {*} data
 * @author Nisar Khokhar
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
