const mongoose = require("mongoose");

const password = encodeURIComponent("KRZ@@705");

const connectDatabase = async () => {
  console.log("Wait connecting to the database");

  mongoose
    .connect(
      `mongodb+srv://Felipinho:${password}@clusterapi.i1mfatc.mongodb.net/?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true}, 
    )
    .then(() => console.log("MongoDB Altas Connected"))
    .catch((err) => console.error(err));
};

module.exports = connectDatabase;
