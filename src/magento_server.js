import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import logger from "./utils/logger.js";
import cronSchedular from "./crons/cronSchedular.js";
import{syncCustomers,ProcessSingleContact} from "./controller/customertoContact.controller.js";
import{syncProducts,processSingleProduct} from "./controller/ProductToProducts.controller.js";
import{syncOrders,processSingleDeal} from "./controller/ordersToDeal.controller.js";
import{syncOrderToLineItems} from "./controller/oderToLineItems.controller.js";



// logger.info("Loaded API Token:", process.env.HUBSPOT_ACCESS_TOKEN);
const PORT = process.env.PORT || 3700;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);

  // ProcessSingleContact();
  // processSingleProduct();
  processSingleDeal();              


});
         