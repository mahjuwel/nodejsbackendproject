const express = require("express");
const https = require("http");
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const cookieParser = require('cookie-parser');
// const morgan= require("morgan");
const xss = require('xss-clean');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { serverPort } = require("./secret");
const userRouter = require("./routers/userRouter");
const connectDB = require("./config/db");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");

const app = express();
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minit
  max: 5,
  message: "Too many requests from this IP. Please try again later."
});
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(xss());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/seed', seedRouter);



app.use((req, res, next) => {
  next(createError(404, 'Api route not found!'));
});

// all the errors will come here in the end from all the routes
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message
  });

});


// const SSLserver = https.createServer({
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// }, app, (req, res)=>{  
//   console.log('server from: ',res);  
// });
const SSLserver = https.createServer(app);

SSLserver.listen(serverPort, () => {
  try {
    console.log(`Secure server 🚀🔑 on port: ${serverPort}`);
    connectDB(); 
  } catch (error) {
    res.status(500).json({ status: "false", "message": "Server is off! It is under maintenance. Please wait."});
    console.log(`Server error: ${error}`);

  }
 
});