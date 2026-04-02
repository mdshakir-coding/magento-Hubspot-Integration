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
            "id": 962,
            "sku": "7017471",
            "name": "Aspirator Bulb",
            "attribute_set_id": 18,
            "price": 7.59,
            "status": 1,
            "visibility": 4,
            "type_id": "simple",
            "created_at": "2016-12-28 20:37:46",
            "updated_at": "2025-11-17 15:48:54",
            "weight": 1,
            "extension_attributes": {
                "website_ids": [
                    1
                ],
                "category_links": [
                    {
                        "position": 1,
                        "category_id": "49"
                    },
                    {
                        "position": 1,
                        "category_id": "68"
                    },
                    {
                        "position": 0,
                        "category_id": "53"
                    }
                ]
            },
            "product_links": [],
            "options": [],
            "media_gallery_entries": [
                {
                    "id": 2965,
                    "media_type": "image",
                    "label": null,
                    "position": 1,
                    "disabled": false,
                    "types": [
                        "image",
                        "small_image",
                        "thumbnail"
                    ],
                    "file": "/a/s/aspirator_bulb.jpg"
                }
            ],
            "tier_prices": [],
            "custom_attributes": [
                {
                    "attribute_code": "image",
                    "value": "/a/s/aspirator_bulb.jpg"
                },
                {
                    "attribute_code": "small_image",
                    "value": "/a/s/aspirator_bulb.jpg"
                },
                {
                    "attribute_code": "thumbnail",
                    "value": "/a/s/aspirator_bulb.jpg"
                },
                {
                    "attribute_code": "options_container",
                    "value": "container1"
                },
                {
                    "attribute_code": "msrp_display_actual_price_type",
                    "value": "0"
                },
                {
                    "attribute_code": "url_key",
                    "value": "aspirator-bulb"
                },
                {
                    "attribute_code": "gift_message_available",
                    "value": "0"
                },
                {
                    "attribute_code": "url_path",
                    "value": "aspirator-bulb"
                },
                {
                    "attribute_code": "required_options",
                    "value": "0"
                },
                {
                    "attribute_code": "has_options",
                    "value": "0"
                },
                {
                    "attribute_code": "meta_title",
                    "value": ""
                },
                {
                    "attribute_code": "meta_keyword",
                    "value": ""
                },
                {
                    "attribute_code": "meta_description",
                    "value": "Aspirator bulb for smoke tubes"
                },
                {
                    "attribute_code": "tax_class_id",
                    "value": "14"
                },
                {
                    "attribute_code": "cpsd_url_key",
                    "value": "0"
                },
                {
                    "attribute_code": "category_ids",
                    "value": [
                        "49",
                        "68",
                        "53"
                    ]
                },
                {
                    "attribute_code": "short_description",
                    "value": "Aspirator bulb for smoke tubes"
                },
                {
                    "attribute_code": "sw_featured",
                    "value": "0"
                },
                {
                    "attribute_code": "description",
                    "value": "Aspirator bulb for smoke tubes"
                },
                {
                    "attribute_code": "country_of_manufacture",
                    "value": ""
                },
                {
                    "attribute_code": "c2c_featured",
                    "value": "0"
                },
                {
                    "attribute_code": "c2c_additional_catoverride",
                    "value": "0"
                },
                {
                    "attribute_code": "c2c_upc",
                    "value": ""
                },
                {
                    "attribute_code": "c2c_length",
                    "value": ""
                },
                {
                    "attribute_code": "c2c_width",
                    "value": ""
                },
                {
                    "attribute_code": "c2c_height",
                    "value": ""
                },
                {
                    "attribute_code": "product_image_size",
                    "value": "0"
                }
            ]
        },
 ) {
  try {
    logger.info(`🔍 Processing Product: ${JSON.stringify(product, null, 2)}`);

    const upsertedProduct = await upsertHubspotProduct(product);

    if (upsertedProduct?.id) {
      logger.info(
        `✅ Upserted Product ID: ${JSON.stringify(upsertedProduct, null, 2)}`,
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
