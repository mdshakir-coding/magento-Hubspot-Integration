


import cloudscraper from "cloudscraper";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import  logger  from "../utils/logger.js";
import axios from "axios";


// 🔐 Your credentials
const consumer = {
  key: "5tuwd2wlyghcb1iqvvrzt39l121ffozp",
  secret: "538pvti44389xnrhow6s8npun0npk53a",
};

const token = {
  key: "6m3nyrmin7flhhy5ro4ew4c9py4cnw1b",
  secret: "bapmzxnvcj187s5378lun6ymgvlc344c",
};

// OAuth setup
const oauth = new OAuth({
  consumer,
  signature_method: "HMAC-SHA256",
  hash_function(base_string, key) {
    return crypto
      .createHmac("sha256", key)
      .update(base_string)
      .digest("base64");
  },
});

// ✅ Fetch Magento Customers with pagination

// async function getMagentoCustomers() {
//   let currentPage = 1;
//   const pageSize = 100;
//   let allCustomers = [];
//   let hasMore = true;

//   while (hasMore) {
//     const url = `https://sensidyne.com/shop/rest/V1/customers/search?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

//     const request_data = {
//       url,
//       method: "GET",
//     };

//     // ✅ Generate FULL OAuth header
//     const authHeader = oauth.toHeader(
//       oauth.authorize(request_data, token)
//     );

//     try {
//       const response = await cloudscraper.get(url, {
//         headers: {
//           ...authHeader,
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//           Accept: "application/json",
//         },
//       });

//       const data = JSON.parse(response);
//       const customers = data.items || [];

//       logger.info(`👤 Page ${currentPage}: ${ JSON.stringify(customers.length)} customers`);

//       // ✅ Collect data
//       allCustomers.push(...customers);
//       return allCustomers; //todo remove

//       // ✅ Stop condition
//       if (customers.length < pageSize) {
//         hasMore = false;
//       } else {
//         currentPage++;
//       }

//     } catch (err) {
//       logger.error(`❌ Error on page ${currentPage}:`, err.message);
//       break;
//     }
//   }

//   logger.info(`✅ Total Customers: ${JSON.stringify(allCustomers.length)}`);
//   return allCustomers;
// }


async function getMagentoCustomers() {
  let currentPage = 1;
  const pageSize = 100;
  let allCustomers = [];
  let hasMore = true;

  while (hasMore) {
    const url = `https://sensidyne.com/shop/rest/V1/customers/search?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

    const request_data = {
      url,
      method: "GET",
    };

    // ✅ OAuth header
    const authHeader = oauth.toHeader(
      oauth.authorize(request_data, token)
    );

    try {
      const response = await axios.get(url, {
        headers: {
          ...authHeader,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "application/json",
        },
      });

      const data = response.data;
      const customers = data.items || [];

      // logger.info(`👤 Page ${currentPage}: ${customers.length} customers`);

      // ✅ Collect customers
      allCustomers.push(...customers);
      return allCustomers; //todo remove after Testing

      // ✅ Stop condition
      if (customers.length < pageSize) {
        hasMore = false;
      } else {
        currentPage++;
      }

    } catch (err) {
      logger.error(`❌ Error on page ${JSON.stringify(currentPage)}:`, err.message);
      break;
    }
  }

  logger.info(`✅ Total Customers: ${JSON.stringify(allCustomers.length)}`);
  return allCustomers;
}

// ✅ Fetch Magento Products with pagination

// async function getMagentoProducts() {
//   let currentPage = 1;
//   const pageSize = 100;
//   let allProducts = [];
//   let hasMore = true;

//   while (hasMore) {
//     const url = `https://sensidyne.com/shop/rest/V1/products?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

//     const request_data = {
//       url,
//       method: "GET",
//     };

//     const authHeader = oauth.toHeader(
//       oauth.authorize(request_data, token)
//     );

//     try {
//       const response = await cloudscraper.get(url, {
//         headers: {
//           ...authHeader,
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//           Accept: "application/json",
//         },
//       });

//       const data = JSON.parse(response);

//       const products = data.items || [];

//       logger.info(`📦 Page ${JSON.stringify(currentPage)}: ${JSON.stringify(products.length)} products`);

//       // Add to master list
//       allProducts.push(...products);
//       return allProducts; //todo remove 

//       // Stop condition
//       if (products.length < pageSize) {
//         hasMore = false;
//       } else {
//         currentPage++;
//       }

//     } catch (err) {
//       logger.error(`❌ Error on page ${JSON.stringify(currentPage)}:`, err.message);
//       break;
//     }
//   }

//   logger.info(`✅ Total Products Fetched: ${JSON.stringify(allProducts.length)}`);
//   return allProducts;
// }


async function getMagentoProducts() {
  let currentPage = 1;
  const pageSize = 100;
  let allProducts = [];
  let hasMore = true;

  while (hasMore) {
    const url = `https://sensidyne.com/shop/rest/V1/products?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

    const request_data = {
      url,
      method: "GET",
    };

    const authHeader = oauth.toHeader(
      oauth.authorize(request_data, token)
    );

    try {
      const response = await axios.get(url, {
        headers: {
          ...authHeader,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "application/json",
        },
      });

      const data = response.data;
      const products = data.items || [];

      logger.info(`📦 Page ${currentPage}: ${products.length} products`);

      // ✅ Add to master list
      allProducts.push(...products);
      return allProducts; //todo Remove After Testing

      // ✅ Pagination stop condition
      if (products.length < pageSize) {
        hasMore = false;
      } else {
        currentPage++;
      }

    } catch (err) {
      logger.error(`❌ Error on page ${currentPage}:`, err.message);
      break;
    }
  }

  logger.info(`✅ Total Products Fetched: ${allProducts.length}`);
  return allProducts;
}

// ✅ Fetch Magento Orders with pagination


// async function getMagentoOrders() {
//   let currentPage = 1;
//   const pageSize = 100;
//   let allOrders = [];
//   let hasMore = true;

//   while (hasMore) {
//     const url = `https://sensidyne.com/shop/rest/V1/orders?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

//     const request_data = {
//       url,
//       method: "GET",
//     };

//     const authHeader = oauth.toHeader(
//       oauth.authorize(request_data, token)
//     );

//     try {
//       const response = await cloudscraper.get(url, {
//         headers: {
//           ...authHeader,
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//           Accept: "application/json",
//         },
//       });

//       const data = JSON.parse(response);
//       const orders = data.items || [];

//       logger.info(`🧾 Page ${currentPage}: ${JSON.stringify(orders.length)} orders`);

//       // ✅ Add to master list
//       allOrders.push(...orders);
//       return allOrders; //todo remove

//       // ✅ Stop condition
//       if (orders.length < pageSize) {
//         hasMore = false;
//       } else {
//         currentPage++;
//       }

//     } catch (err) {
//       logger.error(`❌ Error on page ${JSON.stringify(currentPage)}:`, err.message);
//       break;
//     }
//   }

//   logger.info(`✅ Total Orders Fetched: ${allOrders.length}`);
//   return allOrders;
// }


async function getMagentoOrders() {
  let currentPage = 1;
  const pageSize = 100;
  let allOrders = [];
  let hasMore = true;

  while (hasMore) {
    const url = `https://sensidyne.com/shop/rest/V1/orders?searchCriteria[currentPage]=${currentPage}&searchCriteria[pageSize]=${pageSize}`;

    const request_data = {
      url,
      method: "GET",
    };

    const authHeader = oauth.toHeader(
      oauth.authorize(request_data, token)
    );

    try {
      const response = await axios.get(url, {
        headers: {
          ...authHeader,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Accept: "application/json",
        },
        timeout: 10000, // ✅ optional but recommended
      });

      const data = response.data;
      const orders = data.items || [];

      logger.info(`🧾 Page ${currentPage}: ${orders.length} orders`);

      // ✅ Add to master list
      allOrders.push(...orders);
      return allOrders; // todo remove after Testing

      // ✅ Stop condition
      if (orders.length < pageSize) {
        hasMore = false;
      } else {
        currentPage++;
      }

    } catch (err) {
      logger.error(`❌ Error on page ${currentPage}:`, err.message);
      break;
    }
  }

  logger.info(`✅ Total Orders Fetched: ${allOrders.length}`);
  return allOrders;
}







export { getMagentoCustomers,getMagentoProducts,getMagentoOrders };




