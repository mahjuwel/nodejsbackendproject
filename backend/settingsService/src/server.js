const express = require("express");
const https= require("http");
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const morgan = require("morgan");
const xss = require('xss-clean');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const { serverPort } = require("./secret");
const connectDB = require("./config/db");
const { errorResponse } = require("./controllers/responseController");
const zoneRouter = require("./routers/zoneRouter");
const regionRouter = require("./routers/regionRouter");
const areaRouter = require("./routers/areaRouter");
const bankRouter = require("./routers/bank");
const salesOrganizationRouter = require("./routers/salesOrganization");
const DistributorTypeRouter = require("./routers/distributorType");
const OutletTypeRouter = require("./routers/outletType");
const OutletTargetRouter = require("./routers/outletTargetRouter");
const OutletChannelRouter = require("./routers/outletChannelRouter");
const OfferTypeRouter = require("./routers/offerTypeRouter");
const DiscountTypeRouter = require("./routers/discountTypeRouter");
const DesignationRouter = require("./routers/designationRouter");
const UserTypeRouter = require("./routers/userTypeRouter");
const productBrandRouter = require("./routers/productBrandRouter");
const ProductCategoryRouter = require("./routers/productCategoryRouter");
const dbPoint = require("./routers/dbPointRouter");
const areasRouter = require("./routers/areasRouter");

const app = express();
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minit
  max: 5,
  message: "Too many requests from this IP. Please try again later."
});

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use(xss());


app.use('/api/v1/zone', zoneRouter);
app.use('/api/v1/region', regionRouter)
app.use('/api/v1/area', areaRouter)
app.use('/api/v1/areas', areasRouter)
app.use('/api/v1/dbPoint', dbPoint)
app.use('/api/v1/bank', bankRouter)
app.use('/api/v1/salesOrg', salesOrganizationRouter)
app.use('/api/v1/distributorType', DistributorTypeRouter)
app.use('/api/v1/outletType', OutletTypeRouter)
app.use('/api/v1/outletTarget', OutletTargetRouter)
app.use('/api/v1/outletChannel', OutletChannelRouter)
app.use('/api/v1/offerType', OfferTypeRouter)
app.use('/api/v1/discountType', DiscountTypeRouter)
app.use('/api/v1/designation', DesignationRouter)
app.use('/api/v1/userType', UserTypeRouter)
app.use('/api/v1/productBrand', productBrandRouter)
app.use('/api/v1/productCategory', ProductCategoryRouter)



app.get("/", async (req, res, next) => {
  res.json("Setting Service server is running")
})

app.use((req, res, next) => {
  next(createError(404, 'route not found'));
});

// all the errors will come here in the end from all the routes
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message
  });

});

// const SSLserver= https.createServer({
//   key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//   cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
// },app);

const SSLserver= https.createServer(app);

SSLserver.listen(serverPort, ()=>{
console.log(`Secure server 🚀🔑 on port: ${serverPort}`);
connectDB();
});