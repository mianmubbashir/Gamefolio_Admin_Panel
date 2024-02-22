const mongoose = require("mongoose");
console.log("MONGOOSE: ", process.env.DATABASE_URL);
const uri = process.env.DATABASE_URL;

function myDbConnection() {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("Succesfull");
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
}

module.exports = { myDbConnection };
