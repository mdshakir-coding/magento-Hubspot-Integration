import logger from "../utils/logger.js";
import { getMagentoCustomers } from "../services/magento.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";
import { searchHubspotContactByEmail } from "../services/hubspot.js";
import { updateHubspotContact } from "../services/hubspot.js";
import { createHubspotContact } from "../services/hubspot.js";
import { upsertHubspotContact } from "../services/hubspot.js";
import { associateContactWithDeal } from "../services/hubspot.js";
import{upsertHubspotOrder} from "../services/hubspot.js";
import{buildOrdersPayload} from "../utils/ordersToDeal.Mapping.js";


async function syncCustomers() {
  try {
    // Fetch Magento Customers data
    const allCustomers = await getMagentoCustomers();
   

    for (const customer of allCustomers) {
  
      logger.info(
        `[Magento] Customer Record:\n${JSON.stringify(customer, null, 2)}`
      );
      try {
        // Build the HubSpot payload
        const customerPayload = buildCustomerPayload(customer);

        logger.info(
          `✅ Customer Payload:\n${JSON.stringify(customerPayload, null, 2)}`,
        );
        // break;
        // Upsert customer to HubSpot
        let upsertedContactId = null;
        upsertedContactId = await upsertHubspotContact(customer);

        if (upsertedContactId) {
          logger.info(
            `✅ Upserted Contact ID: ${JSON.stringify(upsertedContactId)}`,
          );
        } else {
          logger.error(
            `❌ Failed to upsert contact for customer ID: ${JSON.stringify(customer.id)}`,
          );
        }
        
        
      } catch (error) {
        logger.error(`❌ Error processing customer ${JSON.stringify(customer.id)}:`, error);
      }
    }
  } catch (error) {
    logger.error("❌ Error syncing customers:", error);
  }
}

export { syncCustomers };
