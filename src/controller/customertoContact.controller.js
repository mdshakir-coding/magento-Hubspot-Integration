import logger from "../utils/logger.js";
import { getMagentoCustomers } from "../services/magento.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";
import{searchHubspotContactByEmail} from "../services/hubspot.js";
import{updateHubspotContact} from "../services/hubspot.js";
import{createHubspotContact} from "../services/hubspot.js";
import{upsertHubspotContact} from "../services/hubspot.js";
import{associateContactWithDeal} from "../services/hubspot.js";


async function syncCustomers() {
  try {
    // Fetch Magento Customers data
    const allCustomers = await getMagentoCustomers();
    
    // logger.info(
    //   "✅ Successfully synced customers:",
    //   `${allCustomers.length} customers fetched`,
    // );
  // return;
  for (const customer of allCustomers) {
    logger.info(
  `[Magento] Customer Record  :\n${JSON.stringify(customer, null, 2)}`
);

  // try {
  //   // ✅ Build HubSpot Contact Payload
  //   const customerPayload =  buildCustomerPayload(customer);

  //   logger.info(
  //     `✅ Customer Payload:\n${JSON.stringify(customerPayload, null, 2)}`
  //   );
  //     // return; //todo remove

  //     // ✅ Search for existing contact in HubSpot by email

  //   const existingContact = await searchHubspotContactByEmail(
  //     customerPayload.email
  //   );

  //   logger.info(
  //     `✅ Search Result for ${customerPayload.email}:\n${JSON.stringify(
  //       existingContact,
  //       null,
  //       2
  //     )}`
  //   );
  //   // break;

  //   let contactId;

  //   if (existingContact?.id) {
  //     // ✅ UPDATE FLOW
  //     contactId = await updateHubspotContact(
  //       existingContact.id,
  //       customerPayload
  //     );

  //     logger.info(`✅ Updated Contact ID: ${JSON.stringify(contactId, null, 2)} | ID: ${contactId,null,2}`);
  //   } else {
  //     // ✅ CREATE FLOW (THIS IS YOUR CURRENT CASE)
  //     contactId = await createHubspotContact(customerPayload);

  //     logger.info(`🆕 Created Contact ID: ${JSON.stringify(contactId)}`);

  //     return; //todo remove



  //   }
  // } catch (error) {
  //   logger.error(`❌ Error processing customer ${customer.id}:`, error);
  // }


 try {
        // Build the HubSpot payload
        const customerPayload = buildCustomerPayload(customer);

        logger.info(`✅ Customer Payload:\n${JSON.stringify(customerPayload, null, 2)}`);

        // Upsert customer
        const upsertedContactId = await upsertHubspotContact(customer);

        if (upsertedContactId) {
          logger.info(`✅ Upserted Contact ID: ${upsertedContactId}`);
        } else {
          logger.error(`❌ Failed to upsert contact for customer ID: ${email.id}`);
        }

      } catch (error) {
        logger.error(`❌ Error processing customer ${customer.id}:`, error);
      }
    }

  } catch (error) {
    logger.error("❌ Error syncing customers:", error);
  }
}

export { syncCustomers };
