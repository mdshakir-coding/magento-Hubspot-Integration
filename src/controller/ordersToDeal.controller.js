import logger from "../utils/logger.js";
import { getMagentoOrders } from "../services/magento.js";
import { buildOrdersPayload } from "../utils/ordersToDeal.Mapping.js";
import { upsertHubspotOrder } from "../services/hubspot.js";
import { updateHubspotOrder } from "../services/hubspot.js";
import { createHubspotOrder } from "../services/hubspot.js";
import { associateContactWithDeal } from "../services/hubspot.js";
import { upsertHubspotContact } from "../services/hubspot.js";
import { searchHubspotContactByEmail } from "../services/hubspot.js";
import { createLineItem } from "../services/hubspot.js";
import { mapOrderToLineItems } from "../utils/orderToLineItem.Mapping.js";
import { associateLineItemWithDeal } from "../services/hubspot.js";
import { searchDealsBySourceId } from "../services/hubspot.js";
import { searchHubspotProductBySku } from "../services/hubspot.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";
import { csvToJson } from "../utils/csvToJson.js";
import { transformRecordToMagentoOrder } from "../utils/helper.js";

async function syncOrders() {
  try {
    // const allOrders = await getMagentoOrders();
    // Get orders from csv file
    const jsonData = csvToJson();

    for (const order of jsonData) {
      try {
        logger.info(`Row Data :\n${JSON.stringify(order, null, 2)}`);

        const record = transformRecordToMagentoOrder(order);
        logger.info(
          `[Magento] Order Record:\n${JSON.stringify(record, null, 2)}`
        );
        await processSingleDeal(record);
      } catch (orderError) {
        logger.error(
          `❌ Error processing Order ${JSON.stringify(order?.increment_id)}:`,
          orderError
        );
      }
    }
  } catch (syncError) {
    logger.error("❌ Error syncing orders:", syncError);
  }
}

async function processSingleDeal(order) {
  try {
    logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);

    // 1️⃣ Upsert HubSpot Deal/Order
    const upsertedOrder = await upsertHubspotOrder(order);

    if (!upsertedOrder?.id) {
      logger.error(
        `❌ Failed to upsert order External ID: ${JSON.stringify(
          order?.increment_id
        )}`
      );
      return;
    }
    const dealId = upsertedOrder.id;
    // logger.info(`✅ Deal ID: ${JSON.stringify(dealId, null, 2)}`);

    // 2️⃣ Get sourceid
    const sourceid = order?.increment_id;
    if (!sourceid) {
      logger.warn(
        `⚠️ No increment_id for order ${JSON.stringify(order?.increment_id)}`
      );
      return;
    }

    // 4️⃣ Upsert HubSpot Contact
    const upsertedContact = await upsertHubspotContact(order);
    if (!upsertedContact) {
      logger.error(
        `❌ Failed to upsert contact for email ${JSON.stringify(
          upsertedContact
        )}`
      );
      return;
    }
    const contactId = upsertedContact;
    logger.info(`✅ Contact ID: ${JSON.stringify(contactId, null, 2)}`);

    // 5️⃣ Associate Contact with Deal
    const association = await associateContactWithDeal({ contactId, dealId });
    if (!association) {
      logger.error(
        `❌ Failed to associate contact with deal for order ${JSON.stringify(
          order?.increment_id
        )}`
      );
      return;
    }

    // 5️⃣ Create Line Items + Associate with Deal
    if (order?.items?.length) {
      for (const item of order.items) {
        logger.info(
          `[Magento] Order Item Record:\n${JSON.stringify(item, null, 2)}`
        );

        // search Product SKU
        const productInfo = await searchHubspotProductBySku(item.sku);
        logger.info(
          `🔍 Search Product by SKU ${item.sku}:\n${JSON.stringify(
            productInfo,
            null,
            2
          )}`
        );

        const payload = mapOrderToLineItems(item, productInfo);
        logger.info(
          `📦 Line Item Payload:\n${JSON.stringify(payload, null, 2)}`
        );

        const lineItem = await createLineItem(payload);

        if (!lineItem?.id) {
          logger.error("❌ Failed to create line item");
          continue;
        }

        logger.info(`✅ Line Item ID: ${JSON.stringify(lineItem.id)}`);

        const association = await associateLineItemWithDeal({
          lineItemId: lineItem.id,
          dealId,
        });

        logger.info(
          `🔗 LineItem ↔ Deal Association:\n${JSON.stringify(
            association,
            null,
            2
          )}`
        );
      }
    }
  } catch (error) {
    logger.error("❌ Error processing  Deal:", error.message);
  }
}

export { syncOrders, processSingleDeal };
