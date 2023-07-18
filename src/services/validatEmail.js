const validator = require("deep-email-validator");
const { spawn } = require("child_process");

/**
 * This takes input an array of objects and adds more key value pairs to each item of array
 * @author Nisar Khokhar
 * @param {*} JsonDataforDb
 * @returns
 */

const runPythonScript = async (item) => {
  const result1 = await new Promise((resolve, reject) => {
    const stringified_data = JSON.stringify(item.Email);
    const python = spawn("python3", ["pythonfile.py", stringified_data]);
    let result = "";

    python.stdout.on("data", function (data) {
      result += data;
    });

    python.stdout.on("close", function (code) {
      resolve(result);
    });

    python.stderr.on("error", function (err) {
      reject(err);
    });
  });

  return result1;
};

const validatefordb = async (JsonDataforDb) => {
  let validatedDataforDb = [];

  while (JsonDataforDb.length) {
    const data = JsonDataforDb.splice(
      0,
      JsonDataforDb.length > 50000 ? 50000 : JsonDataforDb.length
    );
    const dataCheck = data.filter((item) => {
      if (item.Email !== "") {
        return item;
      }
    });

    const temp = await Promise.all(
      dataCheck.map(async (item) => {
        const { valid, reason, validators } = await validator.validate(
          item.Email
        );

        if (
          validators.typo.valid &&
          validators.regex.valid
          // validators.disposable.valid
        ) {
          await runPythonScript(item)
            .then((data) => {
              item.T = validators.typo.valid;
              // item.D = validators.disposable.valid;
              item.RE = validators.regex.valid;
              if (data.includes("True")) {
                data = true;
                item.R = "Valid Email";
              } else {
                data = false;
                item.R = "Invalid Email";
              }
              item.M = data;
              item.S = data;
              item.Valid = data;
            })
            .catch((err) => {
              return err;
            });
          return item;
        } else {
          // item.D = validators.disposable.valid;
          item.T = validators.typo.valid;
          item.RE = validators.regex.valid;
          item.M = false;
          item.S = false;
          item.Valid = false;
          item.R = "Invalid Email";

          return item;
        }
      })
    );
    validatedDataforDb = [...validatedDataforDb, ...temp];
  }
  return validatedDataforDb;
};

module.exports = validatefordb;
