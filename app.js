require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
//MongoDB Connection Setup
const mongoose = require("mongoose");

const port = process.env.PORT || 3001;


//API security
app.use(helmet());

// //handle CORS error
app.use(cors());

//Error handler
const handleError = require("./src/utils/errorHandle");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MongoDB is conneted");
  });

  mDb.on("error", (error) => {
    console.log(error);
  });

  //Logger
  app.use(morgan("tiny"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const userRouter = require("./src/routers/user.router");

app.use("/v1/user", userRouter);


app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.use('/',(req,res) =>{
  res.json({message:'hello world!'});
});


app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
  });