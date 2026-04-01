import axios from "axios";
import logger from "../utils/logger.js";
import { buildProductPayload } from "../utils/productToProducts.mapping.js";
import { buildOrdersPayload } from "../utils/ordersToDeal.Mapping.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";




// SEARCH CONTACT BY EMAIL

async function searchHubspotContactByEmail(email) {
  try {
    email = email?.toLowerCase().trim();

    if (!email) return null;

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts/search",
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: email,
              },
            ],
          },
        ],
        properties: ["email", "firstname", "lastname", "phone", "company"],
        limit: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.results;

    if (!results || results.length === 0) {
      return null;
    }

    return results[0];

  } catch (error) {
    console.error(
      "❌ Error searching HubSpot contact:",
      error.response?.data || error.message
    );
    return null;
  }
}


//  Update HubSpot contact 

async function updateHubspotContact(contactId, properties) {
  try {
    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`🔄 Contact updated successfully | ID: ${contactId}`);

    return response.data;

  } catch (error) {
    console.error(
      "❌ Error updating contact:",
      error.response?.data || error.message
    );
    return null;
  }
}


// create HubSpot contact if not exists

async function createHubspotContact(properties) {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contactId = response.data.id;

    logger.info(`🆕 Contact created successfully | ID: ${contactId}`);

    return contactId;

  } catch (error) {
    console.error(
      "❌ Error creating contact:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Using Upsert Logic for Contact (Combined Search + Update/Create)

// UPSERT HUBSPOT CONTACT
async function upsertHubspotContact(customer) {
  try {
    // 1️⃣ Build payload
    const customerPayload = buildCustomerPayload(customer);

    // 2️⃣ Normalize email
    const email = customerPayload?.email?.toLowerCase()?.trim();
    if (!email) {
      logger.error("❌ Cannot upsert contact without email");
      return null;
    }

    // 3️⃣ Search for existing contact by email
    const existingContact = await searchHubspotContactByEmail(email);
    logger.info(
      `🔍 Search Result for Email ${email}:\n${JSON.stringify(existingContact, null, 2)}`
    );

    // 4️⃣ Update if exists
    if (existingContact?.id) {
      logger.info(`🔄 Contact exists. Updating Email: ${email}`);
      const updatedContact = await updateHubspotContact(existingContact.id, customerPayload);
      if (updatedContact?.id) {
        logger.info(`✅ Contact upserted (updated) | ID: ${JSON.stringify(updatedContact, null, 2)} ;`);
        return updatedContact.id;
      } else {
        logger.error(`❌ Failed to update contact ID: ${JSON.stringify(existingContact, null, 2)}`);
        return null;
      }
    }

    // 5️⃣ Create if not exists
    logger.info(`➕ Contact does not exist. Creating Email: ${email}`);
    const createdContactId = await createHubspotContact(customerPayload);
    if (createdContactId) {
      logger.info(`✅ Contact upserted (created) | ID: ${JSON.stringify(createdContactId, null, 2)}`);
      return createdContactId;
    }

    return null;

  } catch (error) {
    logger.error("❌ Error in upsertHubspotContact:", error.message);
    return null;
  }
}


// Search Products Fnction


async function searchHubspotProductBySku(sku) {
  try {
    if (!sku) return null;

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/products/search",
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "hs_sku",
                operator: "EQ",
                value: sku,
              },
            ],
          },
        ],
        properties: ["name", "hs_sku", "price"],
        limit: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const results = response.data.results;

    if (!results || results.length === 0) {
      console.log(`🔍 No product found for SKU: ${sku}`);
      return null;
    }

    logger.info(`✅ Product found for SKU: ${sku}`);
    return results[0];

  } catch (error) {
    logger.error(
      "❌ Error searching product:",
      error.response?.data || error.message
    );
    return null;
  }
}
// Update Product in HubSpot

async function updateHubspotProduct(productId, productPayload) {
  try {
    if (!productId) {
      throw new Error("Product ID is required for update");
    }

    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/products/${productId}`,
      productPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`🔄 Updated Product ID: ${JSON.stringify(productId)}`);

    return response.data;

  } catch (error) {
    logger.error(
      "❌ Error updating product:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Create Product in HubSpot

async function createHubspotProduct(productPayload) {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/products",
      productPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(
      `➕ Created Product: ${productPayload.properties.hs_sku}`
    );

    return response.data;

  } catch (error) {
    logger.error(
      "❌ Error creating product:",
      error.response?.data || error.message
    );
    return null;
  }
}


async function upsertHubspotProduct(product) {
  try {
    // Build HubSpot payload here
    const productPayload = buildProductPayload(product);
    const sku = product?.sku;

    if (!sku) {
      logger.error("❌ SKU missing, skipping product");
      return null;
    }

    // Search
    const existingProduct = await searchHubspotProductBySku(sku);
    logger.info(
      `🔍 Search Result for SKU ${sku}:\n${JSON.stringify(existingProduct, null, 2)}`
    );

    // Update if exists
    if (existingProduct?.id) {
      logger.info(`🔄 Product exists. Updating SKU: ${JSON.stringify(existingProduct,null,2)}`);
      return await updateHubspotProduct(existingProduct.id, productPayload);
    }

    // Create if not exists
    logger.info(`➕ Product does not exist. Creating SKU: ${JSON.stringify(sku,null,2)}`);
    return await createHubspotProduct(productPayload);

  } catch (error) {
    logger.error("❌ Error in upsertHubspotProduct:", error.message);
    return null;
  }
}


// 


// ---------------------------
// 1️⃣ Search Order by External ID
// ---------------------------
// async function searchHubspotOrderByExternalId(externalOrderId) {
//   try {
//     const response = await axios.post(
//       "https://api.hubapi.com/crm/v3/objects/deals/search",
//       {
//         filterGroups: [
//           {
//             filters: [
//               {
//                 propertyName: "hs_external_order_id",
//                 operator: "EQ",
//                 value: externalOrderId,
//               },
//             ],
//           },
//         ],
//         properties: ["hs_external_order_id", "hs_order_name", "hs_order_status"],
//         limit: 1,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.results?.[0] || null;
//   } catch (error) {
//     console.error("❌ Error searching HubSpot Order:", error.message);
//     return null;
//   }
// }


async function searchDealsBasic() {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/deals/search",
      {
        limit: 1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`, // 🔐 use env, not hardcoded token
          "Content-Type": "application/json"
        }
      }
    );

    // logger.info("✅ Deals Response:", JSON.stringify(response.data, null, 2));
    return response.data;

  } catch (error) {
    logger.error(
      "❌ Error searching deals:",
      error.response?.data || error.message
    );
    return null;
  }
}

// ---------------------------
// 2️⃣ Update Existing HubSpot Order
// ---------------------------
// async function updateHubspotOrder(orderId, payload) {
//   try {
//     const response = await axios.patch(
//       `https://api.hubapi.com/crm/v3/objects/orders/${orderId}`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     logger.info(`✅ Updated Order ID ${orderId} successfully`);
//     return response.data;
//   } catch (error) {
//     logger.error(`❌ Error updating HubSpot Order ${orderId}:`, error.message);
//     return null;
//   }
// }

async function updateHubspotOrder(orderId, properties) {
  try {
    // HubSpot expects PATCH payload in "properties" key
    const payload = { properties };

    const response = await axios.patch(
      // Use 'deals' if this is actually an order represented as a deal
      `https://api.hubapi.com/crm/v3/objects/deals/${orderId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`✅ Updated Order/Deal ID ${orderId} successfully`);
    return response.data;
  } catch (error) {
    logger.error(
      `❌ Error updating HubSpot Order/Deal ${orderId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

// ---------------------------
// 3️⃣ Create New HubSpot Order
// ---------------------------
async function createHubspotOrder(orderPayload) {
  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/deals",
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    logger.info(`✅ Created new HubSpot deals successfully`);
    return response.data;
  } catch (error) {
    logger.error("❌ Error creating HubSpot deals:", error.message);
    return null;
  }
}

//



// async function createHubspotOrder(payload) {
//   try {
//     // HubSpot expects flat properties, no nested objects
//     const payload = { properties };

//     const response = await axios.post(
//       "https://api.hubapi.com/crm/v3/objects/deals",  // using deals endpoint
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     logger.info(
//       `✅ Created new HubSpot Order/Deal successfully: ${response.data.id}`
//     );
//     return response.data;
//   } catch (error) {
//     logger.error(
//       "❌ Error creating HubSpot Order/Deal:",
//       error.response?.data || error.message
//     );
//     return null;
//   }
// }






// Upsert Order (Combined Logic)
// async function upsertHubspotOrder(order) {
//   try {
//     const orderPayload = buildOrdersPayload(order);
//     const sourceid = order?.increment_id || null;

//     if (!sourceid) {
//       logger.error("❌ Source ID missing, skipping order");
//       return null;
//     }
    

//     const existingOrder = await searchDealsBasic(sourceid);
//     logger.info(
//       `🔍 Search Result for Order ID ${sourceid}:\n${JSON.stringify(existingOrder, null, 2)}`
//     );

//     if (existingOrder?.id) {
//       logger.info(`🔄 Order exists. Updating Source ID: ${JSON.stringify(sourceid,null,2)}`);
      
//       return await updateHubspotOrder(existingOrder.id, orderPayload);
      
//     }

//     logger.info(`➕ Order does not exist. Creating External Order ID: ${JSON.stringify(externalOrderId,null,2)}`);
//     return await createHubspotOrder(orderPayload);

//   } catch (error) {
//     logger.error("❌ Error in upsertHubspotOrder:", error.message);
//     return null;
//   }
// }




// Associate Contact with Deal (Order)


// async function associateContactWithDeal({ contactId, dealId }) {
//   try {
//     if (!contactId || !dealId) {
//       logger.error("❌ Missing contactId or dealId");
//       return null;
//     }

//     // logger.info(`🔗 Associating Contact ${contactId} → Deal ${dealId}`);

//     const response = await axios.put(
//       `https://api.hubapi.com/crm/v3/objects/deals/${dealId}/associations/contacts/${contactId}/contact_to_deal`,
//       {}, // required empty body
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // logger.info(`✅ Associated Contact (${contactId}) ↔ Deal (${dealId})`);

//     return response.data;

//   } catch (error) {
//     const errData = error.response?.data;
//     const msg = errData?.message || error.message;

//     // ✅ Handle duplicate safely
//     if (msg?.includes("already exists")) {
//       logger.warn(
//         `⚠️ Already associated Contact (${contactId}) ↔ Deal (${dealId})`
//       );
//       return true;
//     }

//     logger.error("❌ Association Error DEBUG:", {
//       message: msg,
//       status: error.response?.status,
//       data: errData,
//     });

//     return null;
//   }
// }

// upsert Order with Search → Update/Create Logic

async function upsertHubspotOrder(order) {
  try {
    const orderPayload = buildOrdersPayload(order);
    
    const sourceid = order?.increment_id;
    if (!sourceid) {
      logger.error("❌ Source ID missing, skipping order");
      return null;
    }


    // Search existing deal by sourceid
    const existingOrder = await searchDealsBasic(sourceid);
    logger.info(
      `🔍 Search Result for Order ID ${sourceid}:\n${JSON.stringify(existingOrder, null, 2)}`
    );

    if (existingOrder?.id) {
      logger.info(`🔄 Order exists. Updating Source ID: ${sourceid}`);
      return await updateHubspotOrder(existingOrder.id, orderPayload);
    }

    logger.info(`➕ Order does not exist. Creating Order with Source ID: ${sourceid}`);
    return await createHubspotOrder(orderPayload);

  } catch (error) {
    logger.error(`❌ Error in upsertHubspotOrder for Source ID: ${order?.increment_id}`, error.message);
    return null;
  }
}






// async function associateContactWithDeal({ contactId, dealId }) {
//   const url = "https://api.hubapi.com/crm/v3/associations/contacts/deals/batch/create";

//   const payload = {
//     inputs: [
//       {
//         from: { id: contactId },
//         to: { id: dealId },
//         type: "contact_to_deal"
//       }
//     ]
//   };

//   const response = await axios.post(url, payload, {
//     headers: {
//       Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
//       "Content-Type": "application/json"
//     }
//   });

//   return response.data;
// }

async function associateContactWithDeal({ contactId, dealId }) {
  if (!contactId || !dealId) {
    logger.error("❌ Missing contactId or dealId");
    return null;
  }

  const url = "https://api.hubapi.com/crm/v3/associations/contacts/deals/batch/create";

  const payload = {
    inputs: [
      {
        from: { id: String(contactId) },
        to: { id: String(dealId) },
        type: "contact_to_deal",
      },
    ],
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    logger.info(`✅ Associated Contact (${contactId}) ↔ Deal (${dealId}) successfully`);
    logger.debug(`Association response: ${JSON.stringify(response.data, null, 2)}`);

    return response.data;

  } catch (error) {
    const errData = error.response?.data;
    const msg = errData?.message || error.message;

    // Handle duplicate association safely
    if (msg?.includes("already exists")) {
      logger.warn(`⚠️ Association already exists: Contact (${contactId}) ↔ Deal (${dealId})`);
      return true;
    }

    logger.error("❌ Association Error FULL:", {
      message: msg,
      status: error.response?.status,
      data: errData,
    });

    return null;
  }
}

// Associate Products to Deal (Order)
async function associateProductsToDeal(dealId, productIds,) {
  const url = 'https://api.hubapi.com/crm/v3/associations/deals/products/batch/create';

  // Build the inputs array
  const inputs = productIds.map(productId => ({
    from: { id: dealId },
    to: { id: productId },
    type: 'deal_to_product'
  }));

  try {
    const response = await axios.post(
      url,
      { inputs },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Association Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error associating products to deal:', error.response?.data || error.message);
    throw error;
  }
}





export { searchHubspotContactByEmail,
  updateHubspotContact,
  createHubspotContact,
  searchHubspotProductBySku,
updateHubspotProduct,
createHubspotProduct,
upsertHubspotProduct,
upsertHubspotOrder,
searchDealsBasic,
updateHubspotOrder,
createHubspotOrder,
upsertHubspotContact,
associateContactWithDeal,
associateProductsToDeal,





};