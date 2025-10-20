import mongoose from "mongoose";

const dbConnection = () => {
  console.log("Connecting...")
  mongoose
    .connect(process.env.DB_URL)
    .then((res) => {
      console.log("Database connected successfully: " + res.connection.host);
    })
    .catch((err) => {  //handled outside express
      console.error("Database connection failed: " + err);
    });
};

export default dbConnection
