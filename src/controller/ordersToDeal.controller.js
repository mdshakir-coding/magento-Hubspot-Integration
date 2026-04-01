import logger from "../utils/logger.js";
import { getMagentoOrders } from "../services/magento.js";
import{buildOrdersPayload} from "../utils/ordersToDeal.Mapping.js";
import{upsertHubspotOrder} from "../services/hubspot.js";
import{searchDealsBasic} from "../services/hubspot.js";
import{updateHubspotOrder} from "../services/hubspot.js";
import{createHubspotOrder} from "../services/hubspot.js";
import{associateContactWithDeal} from "../services/hubspot.js";
import{upsertHubspotContact} from "../services/hubspot.js";
import{searchHubspotContactByEmail} from "../services/hubspot.js";



// async function syncOrders() {
//   try {
//     // call the Magento Orders function
//     const allOrders = await getMagentoOrders();

//     for (const order of allOrders) {
//       logger.info(`[Magento] Order Record :\n${JSON.stringify(order, null, 2)}`);
//     }
    
//     // Build Payload Orders
    
//     const ordersPayload = buildOrdersPayload(allOrders[0]); // Example: Build payload for the first order

//     logger.info(`✅ Orders Payload:\n${JSON.stringify(ordersPayload, null, 2)}`);

   
      
//     const upsertOrder = await upsertHubspotOrder(order);

//         if (upsertOrder?.id) {
//           logger.info(`✅ Upserted Order ID: ${JSON.stringify(upsertOrder.id,null,2)}`);
//         } else {
//           logger.error(`❌ Failed to upsert order External ID: ${JSON.stringify(order.external_id)}`, `Order ID: ${JSON.stringify(order?.external_id)}`);
//         }
//       } catch (error) {
//         logger.error(`❌ Error processing Order ${JSON.stringify(order?.external_id)}:`, error);

//       }
    
    

    



//   } catch (error) {
//     logger.error("❌ Error syncing orders:", error);
//   }


// async function syncOrders() {
//   try {
//     // Get all Magento orders
//     const allOrders = await getMagentoOrders();

//     // for (const order of allOrders) {
//     //   try {
//     //     // Log the Magento order
//     //     logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);

//     //     // Build payload for this order
//     //     const orderPayload = buildOrdersPayload(order);

//     //     logger.info(`✅ Orders Payload:\n${JSON.stringify(orderPayload, null, 2)}`);

//     //     // Upsert order in HubSpot
//     //     const upsertOrder = await upsertHubspotOrder(order);

//     //     if (upsertOrder?.id) {
//     //       logger.info(`✅ Upserted Order ID: ${JSON.stringify(upsertOrder.id, null, 2)}`);
//     //     } else {
//     //       logger.error(
//     //         `❌ Failed to upsert order External ID: ${JSON.stringify(order?.increment_id)}`
//     //       );
//     //     }
//     //   } catch (orderError) {
//     //     // Catch errors for individual orders so the loop continues
//     //     logger.error(
//     //       `❌ Error processing Order ${JSON.stringify(order?.increment_id)}:`,
//     //       orderError
//     //     );
//     //   }
//     // }
//   } catch (error) {
//     // Catch errors for the whole sync
//     logger.error("❌ Error syncing orders:", error);
//   }
// }

// async function syncOrders() {
//   try {
//     const allOrders = await getMagentoOrders();

//     for (const order of allOrders) {
//       try {
//         logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);


//         // Build Payload
//         const productPayload =  buildOrdersPayload(order);

//         logger.info(
//           `✅ Orders Payload:\n${JSON.stringify(productPayload, null, 2)}`,
//         );

       
//         // Upsert order to HubSpot
//         let upsertedOrder = null;
//          upsertedOrder = await upsertHubspotOrder(order);

//         if (upsertedOrder?.id) {
         
//           logger.info(`✅ Upserted Order : ${JSON.stringify(upsertedOrder, null, 2)}`);
//         } else {
//           logger.error(
//             `❌ Failed to upsert order External ID: ${JSON.stringify(order?.externalOrderId)}`,
//           );

//         }
//       } catch (orderError) {
//         logger.error(
//           `❌ Error processing Order ${JSON.stringify(order?.externalOrderId)}:`,
//           orderError
//         );
//       }
//     }
//   } catch (syncError) {
//     logger.error("❌ Error syncing orders:", syncError);
//   }
// }




async function syncOrders() {
  try {
    const allOrders = await getMagentoOrders();

    for (const order of allOrders) {
      try {
        logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);

        const orderPayload = buildOrdersPayload(order);

        logger.info(`✅ Orders Payload:\n${JSON.stringify(orderPayload, null, 2)}`);
        // break;

        // 1️⃣ Upsert HubSpot Deal/Order
        const upsertedOrder = await upsertHubspotOrder(order);

        if (!upsertedOrder?.id) {
          logger.error(`❌ Failed to upsert order External ID: ${JSON.stringify(order?.increment_id)}`);
          continue;
        }

        const dealId = upsertedOrder.id;
        logger.info(`✅ Deal ID: ${JSON.stringify(dealId, null, 2)}`);

        // 2️⃣ Get customer email
        const email = order?.customer_email?.toLowerCase();
        if (!email) {
          logger.warn(`⚠️ No customer_email for order ${JSON.stringify(order?.increment_id)}`);
          continue;
        }

        logger.info(`🔍 Searching contact for email: ${email}`);

        // 3️⃣ Search contact by email (DO NOT create here)
        const contact = await searchHubspotContactByEmail(email);
        if (!contact?.id) {
          logger.error(`❌ Contact not found for email ${email}. Run syncCustomers() first.`);
          continue;
        }

        const contactId = contact.id;
        logger.info(`✅ Found Contact ID: ${contactId}`);

        // 4️⃣ Associate Contact ↔ Deal
        const associationResult = await associateContactWithDeal({
          contactId,
          dealId,
        });

        logger.info(`Association Result:\n${JSON.stringify(associationResult, null, 2)}`);

      } catch (orderError) {
        logger.error(`❌ Error processing Order ${order?.increment_id}:`, orderError);
      }
    }
  } catch (syncError) {
    logger.error("❌ Error syncing orders:", syncError);
  }
}









export { syncOrders };
