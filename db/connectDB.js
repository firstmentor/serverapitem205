
const mongoose = require("mongoose");
const Live_URL ="mongodb+srv://jainvikas887:ram123@cluster0.ji699.mongodb.net/coursebookig?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
  return mongoose.connect(Live_URL)

    .then(() => {
      console.log("Database Connection successful");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDB;
