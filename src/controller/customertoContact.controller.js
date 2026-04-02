import logger from "../utils/logger.js";
import { getMagentoCustomers } from "../services/magento.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";
import { searchHubspotContactByEmail } from "../services/hubspot.js";
import { updateHubspotContact } from "../services/hubspot.js";
import { createHubspotContact } from "../services/hubspot.js";
import { upsertHubspotContact } from "../services/hubspot.js";
import { associateContactWithDeal } from "../services/hubspot.js";
import { upsertHubspotOrder } from "../services/hubspot.js";
import { buildOrdersPayload } from "../utils/ordersToDeal.Mapping.js";

async function syncCustomers() {
  try {
    // Fetch Magento Customers Records
    const allCustomers = await getMagentoCustomers();

    for (const customer of allCustomers) {
      try {
        await ProcessSingleContact(customer);
      } catch (error) {
        logger.error(
          `❌ Error processing customer ${JSON.stringify(customer.id)}:`,
          error,
        );
      }
    }
  } catch (error) {
    logger.error("❌ Error syncing customers:", error);
  }
}

async function ProcessSingleContact(
  customer =  {
            "id": 3166,
            "group_id": 2,
            "default_billing": "5050",
            "default_shipping": "3674",
            "created_at": "2020-02-26 17:28:03",
            "updated_at": "2026-01-14 13:45:39",
            "created_in": "Default Store View",
            "email": "kent@colonialscientific.com",
            "firstname": "Mike",
            "lastname": "Rinko",
            "gender": 0,
            "store_id": 1,
            "taxvat": "10-300066231f-001",
            "website_id": 1,
            "addresses": [
                {
                    "id": 3674,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "VA",
                        "region": "Virginia",
                        "region_id": 61
                    },
                    "region_id": 61,
                    "country_id": "US",
                    "street": [
                        "3111 S FERN ST"
                    ],
                    "company": "Arlington WWTP",
                    "telephone": "703-228-6891",
                    "postcode": "22202-2363",
                    "city": "ARLINGTON",
                    "firstname": "Water Pollution",
                    "lastname": "Control Division",
                    "default_shipping": true
                },
                {
                    "id": 3303,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "VA",
                        "region": "Virginia",
                        "region_id": 61
                    },
                    "region_id": 61,
                    "country_id": "US",
                    "street": [
                        "ATTN: Po: 13127661",
                        "910 Industrial St"
                    ],
                    "company": "Westrock CP",
                    "telephone": "804-553-0244",
                    "postcode": "23860-7826",
                    "city": "Hopewell",
                    "firstname": "Westrock",
                    "lastname": "Hopewell Mill 4505"
                },
                {
                    "id": 3304,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "VA",
                        "region": "Virginia",
                        "region_id": 61
                    },
                    "region_id": 61,
                    "country_id": "US",
                    "street": [
                        "910 Industrial St",
                        "Attn PO: 13127661"
                    ],
                    "company": "Westrock CP",
                    "telephone": "804-553-0244",
                    "postcode": "23860",
                    "city": "Hopewell",
                    "firstname": "Westrock",
                    "lastname": "Hopewell Mill 4505"
                },
                {
                    "id": 3577,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "VA",
                        "region": "Virginia",
                        "region_id": 61
                    },
                    "region_id": 61,
                    "country_id": "US",
                    "street": [
                        "2015 W Laburnum Ave"
                    ],
                    "company": "Colonial Scientifc",
                    "telephone": "8045530244",
                    "postcode": "23227",
                    "city": "Richmond",
                    "firstname": "Mike",
                    "lastname": "Rinko"
                },
                {
                    "id": 3751,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "CO",
                        "region": "Colorado",
                        "region_id": 13
                    },
                    "region_id": 13,
                    "country_id": "US",
                    "street": [
                        "ATTN: Warehouse",
                        "1 Jetway Ct"
                    ],
                    "telephone": "804-553-0244",
                    "postcode": "81001-4823",
                    "city": "Pueblo",
                    "firstname": "Bechtel",
                    "lastname": "National"
                },
                {
                    "id": 5050,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "VA",
                        "region": "Virginia",
                        "region_id": 61
                    },
                    "region_id": 61,
                    "country_id": "US",
                    "street": [
                        "19302 TURKEY RD"
                    ],
                    "telephone": "804-553-0244",
                    "postcode": "23146-1531",
                    "city": "ROCKVILLE",
                    "firstname": "Michael",
                    "lastname": "Rinko",
                    "default_billing": true
                },
                {
                    "id": 6080,
                    "customer_id": 3166,
                    "region": {
                        "region_code": "NC",
                        "region": "North Carolina",
                        "region_id": 44
                    },
                    "region_id": 44,
                    "country_id": "US",
                    "street": [
                        "65 Moore Drive",
                        "PC548"
                    ],
                    "company": "NC DHHS Public Health",
                    "telephone": "9197075923",
                    "postcode": "27713",
                    "city": "Durham",
                    "firstname": " Meachelle ",
                    "lastname": "Brathwaite"
                }
            ],
            "disable_auto_group_change": 0,
            "extension_attributes": {
                "is_subscribed": false
            },
            "custom_attributes": [
                {
                    "attribute_code": "tax_exempt_status",
                    "value": "1"
                },
                {
                    "attribute_code": "tax_exempt_cron_status",
                    "value": "0"
                },
                {
                    "attribute_code": "tax_exempt_mail_status",
                    "value": "0"
                },
                {
                    "attribute_code": "tax_exempt_cert_link",
                    "value": "/c/o/colonial_scientific.pdf"
                },
                {
                    "attribute_code": "md_customer_profile_id",
                    "value": "1351178915"
                },
                {
                    "attribute_code": "tax_ex_expiry_date",
                    "value": "2030-02-28 00:00:00"
                },
                {
                    "attribute_code": "override_importer_of_record",
                    "value": "default"
                }
            ]
        },
) {
  try {
    logger.info(`[Magento] Contact Record: ${JSON.stringify(customer, null, 2)}`);

    // Upsert customer to HubSpot
    let upsertedContactId = null;
    upsertedContactId = await upsertHubspotContact(customer);

    if (upsertedContactId) {
      logger.info(
        `✅ Upserted Contact ID: ${JSON.stringify(upsertedContactId,null,2)}`,
      );
    } else {
      logger.error(
        `❌ Failed to upsert contact for customer ID: ${JSON.stringify(customer.id)}`,
      );
    }
  } catch (error) {
    logger.info("❌ Error syncing customers:", error);
  }
}

export { syncCustomers, ProcessSingleContact };
