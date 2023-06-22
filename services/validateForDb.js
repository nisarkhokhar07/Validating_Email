const validator = require("deep-email-validator");

/**
 * it will validate data for DB as it appends new properties in each object present in array which
 * is sent to this as an argument
 * @param {*} processedDataforDb
 * @author Nisar Khokhar
 * @returns
 */

const validatefordb = async (processedDataforDb) => {
  try {
    //made an array where our updated data will be stored
    //which will have objects in which we add more key value pairs
    let validatedDataforDb = [];

    while (processedDataforDb.length) {
      //if data would be of huge size
      //wihout reading it in chunks heap memory will get get and code will throw an error
      const data = processedDataforDb.splice(
        0,
        processedDataforDb.length > 50000 ? 50000 : processedDataforDb.length
      );
      //we add promise.all so that once all the promises would be resolved the code will proceed
      //as we have to use this data later on to push it to db
      const temp = await Promise.all(
        data.map(async (item) => {
          const { valid, reason, validators } = await validator.validate(
            item.Email
          );
          item.Valid = valid;
          if (reason) {
            if (item.Email) {
              item.R = reason;
            } else {
              item.R = "No Email";
            }
          } else {
            item.R = "Valid Email";
          }
          item.T = validators.typo.valid;
          item.S = validators.smtp.valid;
          item.M = validators.mx.valid;
          item.D = validators.disposable.valid;
          item.RE = validators.regex.valid;
          return item;
        })
      );
      validatedDataforDb = [...validatedDataforDb, ...temp];
    }
    return validatedDataforDb;
  } catch (error) {
    console.log("Error while validating data for db --> " + error.message);
  }
};

module.exports = validatefordb;
