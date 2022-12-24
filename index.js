const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authentication = require("./routes/auth/authentication");
const survey= require("./routes/survey/survey")
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config()


const url ="mongodb://udit:P%40ssw0rd123@ac-sjm6zfd-shard-00-00.qexisls.mongodb.net:27017,ac-sjm6zfd-shard-00-01.qexisls.mongodb.net:27017,ac-sjm6zfd-shard-00-02.qexisls.mongodb.net:27017/survey?ssl=true&replicaSet=atlas-5ese32-shard-0&authSource=admin&retryWrites=true&w=majority";
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
app.use("/auth", authentication);
app.use("/app/survey", survey)

app.listen(3000, () => {
  console.log("app is runing");
});
