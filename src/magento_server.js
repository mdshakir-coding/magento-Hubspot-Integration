import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import logger from "./utils/logger.js";
import cronSchedular from "./crons/cronSchedular.js";
import{syncCustomers} from "./controller/customerSync.controller.js";


// logger.info("Loaded API Token:", process.env.HUBSPOT_ACCESS_TOKEN);
const PORT = process.env.PORT || 3700;

app.listen(PORT, () => {
  syncCustomers();

  logger.info(`Server running on port ${PORT}`);
});
