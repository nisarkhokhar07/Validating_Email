const validator = require("deep-email-validator");

/**
 * This takes input an array of objects and adds more key value pairs to each item of array
 * @author Nisar Khokhar
 * @param {*} JsonDataforDb
 * @returns
 */

const validatefordb = async (JsonDataforDb) => {
  let validatedDataforDb = [];

  while (JsonDataforDb.length) {
    const data = JsonDataforDb.splice(
      0,
      JsonDataforDb.length > 50000 ? 50000 : JsonDataforDb.length
    );
    const dataCheck = data.filter((item) => {
      if (item.Email != null) {
        return item;
      }
    });
    const temp = await Promise.all(
      dataCheck.map(async (item) => {
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
};

module.exports = validatefordb;
