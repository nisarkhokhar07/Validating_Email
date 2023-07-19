// const validator = require("deep-email-validator");
// const { spawn } = require("child_process");
// /**
//  * This takes input an array of objects and adds more key value pairs to each item of array
//  * @author Nisar Khokhar
//  * @param {*} JsonDataforDb
//  * @returns
//  */

// const runPythonScript = async (item) => {
//   const result1 = await new Promise((resolve, reject) => {
//     // console.log(typeof item);
//     const stringified_data = JSON.stringify(item.Email);
//     // console.log(typeof stringified_data);
//     const python = spawn("python", ["pythonfile.py", stringified_data]);
//     let result = "";

//     python.stdout.on("data", function (data) {
//       // console.log("HELLO---------->", data.toString());
//       result += data.toString();
//     });

//     python.stdout.on("close", function (code) {
//       // console.log("code---->", code);
//       // console.log("result---->", result);
//       resolve(result);
//     });

//     python.stderr.on("error", function (err) {
//       // console.log(err);
//       reject(err);
//     });
//   });

//   return result1;
// };

// const validatefordb = async (JsonDataforDb) => {
//   let validatedDataforDb = [];

//   while (JsonDataforDb.length) {
//     const data = JsonDataforDb.splice(
//       0,
//       JsonDataforDb.length > 50000 ? 50000 : JsonDataforDb.length
//     );
//     // const dataCheck = data.filter((item) => {
//     //   if (item.Email != null) {
//     //     return item;
//     //   }
//     // });\

//     const dataCheck = [
//       {
//         Email: "malikhassan33.mh@gmail.com",
//       },
//       {
//         Email: "khokharmaliknisar@gmail.com",
//       },
//     ];

//     // console.log(dataCheck);
//     const temp = await Promise.all(
//       dataCheck.map(async (item) => {
//         const { valid, reason, validators } = await validator.validate(
//           item.Email
//         );
//         item.Valid = valid;
//         if (reason) {
//           if (item.Email) {
//             item.R = reason;
//           } else {
//             item.R = "No Email";
//           }
//         } else {
//           item.R = "Valid Email";
//         }
//         if (
//           validators.typo.valid &&
//           validators.disposable.valid &&
//           validators.disposable.valid
//         ) {
//           await runPythonScript(item)
//             .then((data) => {
//               // console.log(data);
//               item.T = validators.typo.valid;
//               item.D = validators.disposable.valid;
//               item.RE = validators.regex.valid;

//               if (data.includes("True")) {
//                 data = true;
//               }
//               item.M = data;
//               item.S = data;
//             })
//             .catch((err) => {
//               return err;
//             });

//           return item;
//         }
//       })
//     );
//     validatedDataforDb = [...validatedDataforDb, ...temp];
//   }

//   return validatedDataforDb;
// };

// module.exports = validatefordb;

const validator = require("deep-email-validator");
const { spawn } = require("child_process");

const runPythonScript = async (item) => {
  const result1 = await new Promise((resolve, reject) => {
    const stringified_data = JSON.stringify(item.Email);
    const python = spawn("python", ["pythonfile.py", stringified_data]);
    let result = "";

    python.stdout.on("data", function (data) {
      result += data.toString();
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
      if (item.Email != null) {
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
          validators.regex.valid &&
          validators.disposable.valid
        ) {
          await runPythonScript(item.Email)
            .then((data) => {
              // console.log(data);
              item.T = validators.typo.valid;
              item.D = validators.disposable.valid;
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
        }
      })
    );
    validatedDataforDb = [...validatedDataforDb, ...temp];
  }
  return validatedDataforDb;
};

module.exports = validatefordb;
