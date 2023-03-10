const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authentication = require("./routes/auth/authentication");
const survey= require("./routes/survey/survey");
const client= require("./routes/survey/client");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config()


const url =process.env.MONGO_DB_URL;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.use(cors({
    origin:"*"
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/auth", authentication);
app.use("/app/survey", survey);
app.use("/client", client);

app.listen(3000, () => {
  console.log("app is runing");
});
