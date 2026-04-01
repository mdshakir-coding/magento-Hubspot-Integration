import logger from "../utils/logger.js";
import { getMagentoProducts } from "../services/magento.js";
import { buildProductPayload } from "../utils/productToProducts.mapping.js";
import { searchHubspotProductBySku } from "../services/hubspot.js";
import { updateHubspotProduct } from "../services/hubspot.js";
import { createHubspotProduct } from "../services/hubspot.js";
import { upsertHubspotProduct } from "../services/hubspot.js";
import { associateProductsToDeal } from "../services/hubspot.js";

async function syncProducts() {
  try {
    // call the Magento Products function
    const allProducts = await getMagentoProducts();

    for (const product of allProducts) {
      // Using Upsert Logic
      try {
        await processSingleProduct(product);
      } catch (error) {
        logger.error(
          `❌ Error processing Product ${JSON.stringify(product?.sku)}:`,
          error,
        );
      }
    }
  } catch (error) {
    logger.error("❌ Error:", error.message);
  }
}

async function processSingleProduct(
  product = {
    id: 973,
    sku: "783-0012-01-R",
    name: "Battery Pack for GilAir Plus",
    attribute_set_id: 18,
    price: 226.88,
    status: 1,
    visibility: 4,
    type_id: "simple",
    created_at: "2017-02-03 01:34:24",
    updated_at: "2025-06-10 12:50:51",
    weight: 2,
    extension_attributes: {
      website_ids: [1],
      category_links: [
        {
          position: 1,
          category_id: "43",
        },
        {
          position: 1,
          category_id: "45",
        },
        {
          position: 0,
          category_id: "71",
        },
      ],
    },
    product_links: [],
    options: [],
    media_gallery_entries: [
      {
        id: 3000,
        media_type: "image",
        label: "",
        position: 1,
        disabled: false,
        types: ["image", "small_image", "thumbnail"],
        file: "/g/i/gilair-plus-nimh-power-pack.jpg",
      },
    ],
    tier_prices: [],
    custom_attributes: [
      {
        attribute_code: "image",
        value: "/g/i/gilair-plus-nimh-power-pack.jpg",
      },
      {
        attribute_code: "small_image",
        value: "/g/i/gilair-plus-nimh-power-pack.jpg",
      },
      {
        attribute_code: "thumbnail",
        value: "/g/i/gilair-plus-nimh-power-pack.jpg",
      },
      {
        attribute_code: "options_container",
        value: "container1",
      },
      {
        attribute_code: "url_key",
        value: "battery-pack-for-gilair-plus",
      },
      {
        attribute_code: "url_path",
        value: "battery-pack-for-gilair-plus",
      },
      {
        attribute_code: "required_options",
        value: "0",
      },
      {
        attribute_code: "has_options",
        value: "0",
      },
      {
        attribute_code: "image_label",
        value: " ",
      },
      {
        attribute_code: "small_image_label",
        value: " ",
      },
      {
        attribute_code: "thumbnail_label",
        value: " ",
      },
      {
        attribute_code: "meta_title",
        value: "",
      },
      {
        attribute_code: "meta_keyword",
        value: "",
      },
      {
        attribute_code: "meta_description",
        value: "GilAir Plus battery pack.",
      },
      {
        attribute_code: "tax_class_id",
        value: "14",
      },
      {
        attribute_code: "category_ids",
        value: ["43", "45", "71"],
      },
      {
        attribute_code: "short_description",
        value: "GilAir Plus battery pack.",
      },
      {
        attribute_code: "description",
        value: "Replacement battery pack for GilAir Plus air sampling pumps.",
      },
      {
        attribute_code: "country_of_manufacture",
        value: "US",
      },
      {
        attribute_code: "c2c_upc",
        value: "",
      },
      {
        attribute_code: "c2c_length",
        value: "",
      },
      {
        attribute_code: "c2c_width",
        value: "",
      },
      {
        attribute_code: "c2c_height",
        value: "",
      },
      {
        attribute_code: "manufacturer",
        value: "0",
      },
    ],
  },
 ) {
  try {
    logger.info(`🔍 Processing Product: ${JSON.stringify(product, null, 2)}`);

    const upsertedProduct = await upsertHubspotProduct(product);

    if (upsertedProduct?.id) {
      logger.info(
        `✅ Upserted Product ID: ${JSON.stringify(upsertedProduct.id, null, 2)}`,
      );

      // return; //todo remove
    } else {
      logger.error(
        `❌ Failed to upsert product SKU: ${JSON.stringify(product?.sku)}`,
      );
    }
  } catch (error) {
    logger.info("❌ Error:", error.message);
  }
}

export { syncProducts, processSingleProduct };
