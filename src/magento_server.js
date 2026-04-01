import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import logger from "./utils/logger.js";
import cronSchedular from "./crons/cronSchedular.js";
import{syncCustomers} from "./controller/customertoContact.controller.js";
import{syncProducts} from "./controller/ProductToProducts.controller.js";
import{syncOrders} from "./controller/ordersToDeal.controller.js";



// logger.info("Loaded API Token:", process.env.HUBSPOT_ACCESS_TOKEN);
const PORT = process.env.PORT || 3700;

app.listen(PORT, () => {
  // syncCustomers();
  syncProducts();
  // syncOrders();



  logger.info(`Server running on port ${PORT}`);
});
