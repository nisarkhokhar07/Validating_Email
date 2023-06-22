const validator = require("deep-email-validator");

const validateemails = async (processedData) => {
  try {
    let validatedData = [];

    while (processedData.length) {
      const data = processedData.splice(
        0,
        processedData.length > 50000 ? 50000 : processedData.length
      );
      const temp = await Promise.all(
        data.map(async (obj) => {
          const { valid } = await validator.validate(obj.Email || obj.email);

          if (valid) {
            obj.Valid = "valid";
          } else {
            obj.Valid = "not valid";
          }

          return obj;
        })
      );
      validatedData = [...validatedData, ...temp];
    }
    return validatedData;
  } catch (error) {
    console.log("Error validating emails for file");
  }
};

module.exports = validateemails;
