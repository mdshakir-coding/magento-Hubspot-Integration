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

import {
  saveProgress,
  loadProgress,
  saveFailedCollectionId,
} from "../utils/saveProgress.js";

async function syncOrders() {
  try {
    // const allOrders = await getMagentoOrders();
    // Get orders from csv file
    const jsonData = csvToJson();

    const startIndex = await loadProgress();

    for (let i = startIndex; i < jsonData.length; i++) {
      try {
        const order = jsonData[i];
        logger.info(`[Magento] Row Data :\n${JSON.stringify(order)}`);

        const record = transformRecordToMagentoOrder(order);
        await processSingleDeal(record);
        saveProgress(i + 1);
        // return; // todo remove after testing
      } catch (error) {
        logger.error(`❌ Error processing Order :`, {
          status: error?.status,
          response: error.response?.data,
          method: error?.method,
          url: error?.config?.url,
          message: error.message,
          stack: error?.stack || error,
        });
        saveProgress(i + 1);
      }
    }
  } catch (syncError) {
    logger.error("❌ Error syncing orders:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

async function processSingleDeal(order) {
  try {
    logger.info(`[Magento] Order Record:\n${JSON.stringify(order)}`);

    // 1️⃣ Upsert HubSpot Deal/Order
    const upsertedOrder = await upsertHubspotOrder(order);

    if (!upsertedOrder || !upsertedOrder?.id) {
      logger.warn(
        `Failed to upsert deal or exising deal External ID: ${JSON.stringify(
          order?.increment_id
        )}`
      );
      return;
    }
    const dealId = upsertedOrder.id;
    // logger.info(` Deal ID: ${JSON.stringify(dealId)}`);

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
        `Failed to upsert contact for email ${JSON.stringify(upsertedContact)}`
      );
      return;
    }
    const contactId = upsertedContact;
    logger.info(` Contact ID: ${JSON.stringify(contactId)}`);

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
        logger.info(`[Magento] Order Item Record:\n${JSON.stringify(item)}`);

        // search Product SKU
        const productInfo = await searchHubspotProductBySku(item.sku);
        logger.info(
          `🔍 Search Product by SKU ${item.sku}:\n${JSON.stringify(
            productInfo
          )}`
        );

        const payload = mapOrderToLineItems(item, productInfo);
        logger.info(`📦 Line Item Payload:\n${JSON.stringify(payload)}`);

        const lineItem = await createLineItem(payload);

        if (!lineItem?.id) {
          logger.error("Failed to create line item");
          continue;
        }

        logger.info(`✅ Line Item ID: ${JSON.stringify(lineItem.id)}`);

        const association = await associateLineItemWithDeal({
          lineItemId: lineItem.id,
          dealId,
        });

        logger.info(
          `🔗 LineItem ↔ Deal Association:\n${JSON.stringify(association)}`
        );
      }
    }
  } catch (error) {
    logger.error("❌ Error processing  Deal:", {
      status: error?.status,
      response: error.response?.data,
      method: error?.method,
      url: error?.config?.url,
      message: error.message,
      stack: error?.stack || error,
    });
  }
}

export { syncOrders, processSingleDeal };
