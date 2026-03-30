import logger from "../utils/logger.js";
import { getMagentoOrders } from "../services/magento.js";
import{buildOrdersPayload} from "../utils/ordersToDeal.Mapping.js";
import{upsertHubspotOrder} from "../services/hubspot.js";
import{searchHubspotOrderByExternalId} from "../services/hubspot.js";
import{updateHubspotOrder} from "../services/hubspot.js";
import{createHubspotOrder} from "../services/hubspot.js";

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

async function syncOrders() {
  try {
    const allOrders = await getMagentoOrders();

    for (const order of allOrders) {
      try {
        logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);


        // Build Payload
        const productPayload =  buildOrdersPayload(order);

        logger.info(
          `✅ Orders Payload:\n${JSON.stringify(productPayload, null, 2)}`,
        );

        // break;
        // Upsert order to HubSpot
        const upsertedOrder = await upsertHubspotOrder(order);

        if (upsertedOrder?.id) {
         
          logger.info(`✅ Upserted Order : ${JSON.stringify(upsertedOrder, null, 2)}`);
        } else {
          logger.error(
            `❌ Failed to upsert order External ID: ${JSON.stringify(order?.externalOrderId)}`,
          );
        }
      } catch (orderError) {
        logger.error(
          `❌ Error processing Order ${JSON.stringify(order?.externalOrderId)}:`,
          orderError
        );
      }
    }
  } catch (syncError) {
    logger.error("❌ Error syncing orders:", syncError);
  }
}




export { syncOrders };
