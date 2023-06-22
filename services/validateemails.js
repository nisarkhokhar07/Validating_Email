const validator = require("deep-email-validator");

/**
 * Returns modified array of objects with extra property of Valid in it which tells whether the email is valid or not
 * @author Nisar Khokhar
 * @param {*} processedData
 * @returns
 */
const validateemails = async (processedData) => {
  try {
    //made an array where our updated data will be stored
    //which will have objects in which we add more key value pairs
    let validatedData = [];

    while (processedData.length) {
      //if data would be of huge size
      //wihout reading it in chunks heap memory will get get and code will throw an error
      const data = processedData.splice(
        0,
        processedData.length > 50000 ? 50000 : processedData.length
      );
      //we add promise.all so that once all the promises would be resolved the code will proceed
      //as we have to use this data later on to write it into file
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
