const mongoose =require('mongoose')

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to databse");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting database", err);
    });
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    console.log("Error connecting to mongo db", err);
    process.exit(1); //stop the server because can't connect to db
  }
};

module.exports= connectDb;