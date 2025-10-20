import {config} from "dotenv";
config({ path: "config.env" });
import express from "express";
import path from 'path'
import morgan from "morgan";
import cors from 'cors'
import compression from "compression";

import dbConnection from "./config/db.js";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/express-middleware/errorMiddleware.js";
import { mountRoutes } from "./routes/index.js";
import { checkoutWebhook } from "./services/controllers/orderService.js";
import html from "./utils/successfulPayment.js";
import rateLimit from "express-rate-limit";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import xssSanitize from "xss-sanitize";
import hppClean from "hpp-clean";

// Connect to DB
dbConnection()
// Express app
const app = express();
// Logging(development)
if (process.env.NODE_ENV == "development")  app.use(morgan("dev"));

// Security & utility middlewares
app.use(cors()) // allow for all origins
app.options(/.*/, cors());
app.use(hppClean({whitelist: ['quantity', 'price', 'sold', 'ratingsAverage', 'ratingsQuantity']})) //Excluded list
app.use(compression()) // gzip response body
app.use(express.static(path.join(import.meta.dirname, 'uploads')))

// Payment
app.get('/orders', (req, res)=> { //Get the status of card payment || optional route for testing, can be created by frontend
  res.status(200).send(html)
})
app.post("/checkout-webhook",
  express.raw({ type: "application/json" }),
  checkoutWebhook
)

//Limiting size and amount
app.use(express.json({limit: '20kb'}));
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: 'Too many requests on auth routes from this IP, please try again after an hour.'
})
app.use('/api/v1/auth', limiter)

// Security & utility middlewares after parsing body
app.use(expressMongoSanitize())
app.use(xssSanitize())


// Mount routes
mountRoutes(app)

// Unmatched route handling middleware
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404))   //specific route handler
})

// Global error handling
app.use(globalError)

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("App running on: http://localhost:" + PORT);
});

// For unhandled process error (outside express)
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`)
  server.close(() => {
   console.log('Shutting down now...')
    process.exit(1)
  })
})