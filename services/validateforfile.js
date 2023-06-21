const validator = require("deep-email-validator");

const validateforfile = async (JsonData) => {
  let validatedData = [];

  while (JsonData.length) {
    const data = JsonData.splice(
      0,
      JsonData.length > 50000 ? 50000 : JsonData.length
    );
    console.log(data.length);
    const temp = await Promise.all(
      data.map(async (obj) => {
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
