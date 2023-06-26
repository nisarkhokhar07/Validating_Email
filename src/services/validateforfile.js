const validator = require("deep-email-validator");

/**
 * This will validate data for file i.e. appends only 1 poperty of validity of email
 * @author Nisar Khokhar
 * @param {*} JsonData
 * @returns
 */

const validateforfile = async (JsonData) => {
  let validatedData = [];

  while (JsonData.length) {
    const data = JsonData.splice(
      0,
      JsonData.length > 50000 ? 50000 : JsonData.length
    );
    console.log(data.length);
    const dataCheck = data.filter((item) => {
      if (item.Email != null) {
        return item;
      }
    });
    const temp = await Promise.all(
      dataCheck.map(async (obj) => {
        const { valid } = await validator.validate(obj.Email);

        if (valid) {
          obj.Valid = "valid email";
        } else {
          obj.Valid = "not valid";
        }

        return obj;
      })
    );
    validatedData = [...validatedData, ...temp];
  }
  return validatedData;
};

module.exports = validateforfile;
