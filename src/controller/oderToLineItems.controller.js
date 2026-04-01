import logger from "../utils/logger.js";
import { getMagentoOrders } from "../services/magento.js";
import { mapOrderToLineItems } from "../utils/orderToLineItem.Mapping.js";

async function syncOrderToLineItems(allOrderLineItems, dealId) {
  try {
    for (const order of allOrderLineItems) {
      try {
        logger.info(
          `[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`,
        );

        const lineItemsPayload = mapOrderToLineItems(order);

        logger.info(
          `✅ Line Items Payload for Order ${order.increment_id}:\n${JSON.stringify(lineItemsPayload, null, 2)}`,
        );
      } catch (error) {
        logger.error(`❌ Error processing Order :`, error);
      }
    }
  } catch (error) {
    logger.error("❌ Error syncing order to line items:", error);
  }
}

export { syncOrderToLineItems };
