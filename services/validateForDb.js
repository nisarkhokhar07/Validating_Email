const validator = require("deep-email-validator");

const validatefordb = async (processedDataforDb) => {
  try {
    let validatedDataforDb = [];

    while (processedDataforDb.length) {
      const data = processedDataforDb.splice(
        0,
        processedDataforDb.length > 50000 ? 50000 : processedDataforDb.length
      );
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
    console.log("Error while validating data for db.");
  }
};

module.exports = validatefordb;
