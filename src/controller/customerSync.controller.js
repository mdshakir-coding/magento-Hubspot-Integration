import logger from "../utils/logger.js";
import { getMagentoCustomers } from "../services/magento.js";


async function syncCustomers() {
  try {


    // Fetch Magento Customers data
    const data = await getMagentoCustomers();
    logger.info("✅ Successfully synced customers:", `${data.length} customers fetched`);



  } catch (error) {
    logger.error("❌ Error syncing customers:", error);
  }
}

export { syncCustomers };
