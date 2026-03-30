import logger from "../utils/logger.js";
import { getMagentoProducts } from "../services/magento.js";
import { buildProductPayload } from "../utils/productToProducts.mapping.js";
import { searchHubspotProductBySku } from "../services/hubspot.js";
import { updateHubspotProduct } from "../services/hubspot.js";
import { createHubspotProduct } from "../services/hubspot.js";
import {upsertHubspotProduct} from "../services/hubspot.js";

async function syncProducts() {
  try {
    // call the Magento Products function
    const allProducts = await getMagentoProducts();

    for (const product of allProducts) {
      logger.info(
        `[Magento] Product Record :\n${JSON.stringify(product, null, 2)}`,
      );
      //   try {
      //     // Build Payload
      //     const productPayload =  buildProductPayload(product);

      //     logger.info(
      //       `✅ Product Payload:\n${JSON.stringify(productPayload, null, 2)}`,
      //     );

      //     // Get SKU safely
      //     const sku = product?.sku;

      //     if (!sku) {
      //       logger.error("❌ SKU missing, skipping product");
      //       return;
      //     }

      //     // 🔍 Search
      //     const existingProduct = await searchHubspotProductBySku(sku);

      //     logger.info(
      //       `🔍 Search Result for SKU ${sku}:\n${JSON.stringify(existingProduct, null, 2)}`,
      //     );

      //     // 🔄 UPDATE
      //     if (existingProduct?.id) {
      //       const updatedProduct = await updateHubspotProduct(
      //         existingProduct.id,
      //         productPayload,
      //       );

      //       if (updatedProduct?.id) {
      //         logger.info(`🔄 Updated Product ID: ${JSON.stringify(updatedProduct,null,2)}`);
      //       } else {
      //         logger.error(`❌ Failed to update product SKU: ${JSON.stringify(sku)}`);
      //       }
      //     }

      //     // ➕ CREATE
      //     else {
      //       const createdProduct = await createHubspotProduct(productPayload);

      //       if (createdProduct?.id) {
      //         logger.info(`➕ Created Product ID: ${createdProduct.id}`);
      //       } else {
      //         logger.error(`❌ Failed to create product SKU: ${sku}`);
      //       }
      //     }
      //   } catch (error) {
      //     logger.error(`❌ Error processing Product ${product.id}:`, error);
      //   }

      // Using Upsert Logic
      try {
        // Build Payload
        const productPayload =  buildProductPayload(product);

        logger.info(
          `✅ Product Payload:\n${JSON.stringify(productPayload, null, 2)}`,
        );

        const upsertedProduct = await upsertHubspotProduct(product);

        if (upsertedProduct?.id) {
          logger.info(`✅ Upserted Product ID: ${upsertedProduct.id}`);
        } else {
          logger.error(`❌ Failed to upsert product SKU: ${product?.sku}`);
        }
      } catch (error) {
        logger.error(`❌ Error processing Product ${product.id}:`, error);
      }
      
    }
  } catch (error) {
    logger.error("❌ Error:", error.message);
  }
}

export { syncProducts };
