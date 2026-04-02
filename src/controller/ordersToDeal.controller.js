import logger from "../utils/logger.js";
import { getMagentoOrders } from "../services/magento.js";
import { buildOrdersPayload } from "../utils/ordersToDeal.Mapping.js";
import { upsertHubspotOrder } from "../services/hubspot.js";
import { updateHubspotOrder } from "../services/hubspot.js";
import { createHubspotOrder } from "../services/hubspot.js";
import { associateContactWithDeal } from "../services/hubspot.js";
import { upsertHubspotContact } from "../services/hubspot.js";
import { searchHubspotContactByEmail } from "../services/hubspot.js";
import { createLineItem } from "../services/hubspot.js";
import { mapOrderToLineItems } from "../utils/orderToLineItem.Mapping.js";
import{associateLineItemWithDeal} from "../services/hubspot.js";
import{searchDealsBySourceId} from "../services/hubspot.js";
import{searchHubspotProductBySku} from "../services/hubspot.js";

async function syncOrders() {
  try {
    const allOrders = await getMagentoOrders();

    for (const order of allOrders) {
      try {
        await processSingleDeal(order);
      } catch (orderError) {
        logger.error(
          `❌ Error processing Order ${JSON.stringify(order?.increment_id)}:`,
          orderError,
        );
      }
    }
  } catch (syncError) {
    logger.error("❌ Error syncing orders:", syncError);
  }
}

async function processSingleDeal(
  order = {
            "base_currency_code": "USD",
            "base_discount_amount": 0,
            "base_discount_invoiced": 0,
            "base_grand_total": 142.31,
            "base_discount_tax_compensation_amount": 0,
            "base_discount_tax_compensation_invoiced": 0,
            "base_shipping_amount": 18.06,
            "base_shipping_discount_amount": 0,
            "base_shipping_discount_tax_compensation_amnt": 0,
            "base_shipping_incl_tax": 18.06,
            "base_shipping_invoiced": 18.06,
            "base_shipping_tax_amount": 0,
            "base_subtotal": 118,
            "base_subtotal_incl_tax": 124.25,
            "base_subtotal_invoiced": 118,
            "base_tax_amount": 6.25,
            "base_tax_invoiced": 6.25,
            "base_total_due": 0,
            "base_total_invoiced": 142.31,
            "base_total_invoiced_cost": 0,
            "base_total_paid": 142.31,
            "base_to_global_rate": 1,
            "base_to_order_rate": 1,
            "billing_address_id": 6028,
            "created_at": "2020-02-26 17:27:09",
            "customer_email": "kent@colonialscientific.com",
            "customer_firstname": "Mike",
            "customer_group_id": 1,
            "customer_id": 3166,
            "customer_is_guest": 0,
            "customer_lastname": "Rinko",
            "customer_note_notify": 0,
            "discount_amount": 0,
            "discount_invoiced": 0,
            "email_sent": 1,
            "entity_id": 3014,
            "global_currency_code": "USD",
            "grand_total": 142.31,
            "discount_tax_compensation_amount": 0,
            "discount_tax_compensation_invoiced": 0,
            "increment_id": "SEN0815202066",
            "is_virtual": 0,
            "order_currency_code": "USD",
            "protect_code": "d77dcf8d8e7cf655afb0a4917d8a5b38",
            "quote_id": 251,
            "remote_ip": "34.199.128.118",
            "shipping_amount": 18.06,
            "shipping_description": "Federal Express - Ground",
            "shipping_discount_amount": 0,
            "shipping_discount_tax_compensation_amount": 0,
            "shipping_incl_tax": 18.06,
            "shipping_invoiced": 18.06,
            "shipping_tax_amount": 0,
            "state": "complete",
            "status": "complete",
            "store_currency_code": "USD",
            "store_id": 1,
            "store_name": "Main Website\nMain Website Store\nDefault Store View",
            "store_to_base_rate": 0,
            "store_to_order_rate": 0,
            "subtotal": 118,
            "subtotal_incl_tax": 124.25,
            "subtotal_invoiced": 118,
            "tax_amount": 6.25,
            "tax_invoiced": 6.25,
            "total_due": 0,
            "total_invoiced": 142.31,
            "total_item_count": 2,
            "total_paid": 142.31,
            "total_qty_ordered": 4,
            "updated_at": "2022-08-25 22:01:09",
            "weight": 4,
            "x_forwarded_for": "50.78.233.85, 50.78.233.85",
            "items": [
                {
                    "amount_refunded": 0,
                    "base_amount_refunded": 0,
                    "base_discount_amount": 0,
                    "base_discount_invoiced": 0,
                    "base_discount_tax_compensation_amount": 0,
                    "base_discount_tax_compensation_invoiced": 0,
                    "base_original_price": 7,
                    "base_price": 7,
                    "base_price_incl_tax": 7.37,
                    "base_row_invoiced": 14,
                    "base_row_total": 14,
                    "base_row_total_incl_tax": 14.74,
                    "base_tax_amount": 0.74,
                    "base_tax_invoiced": 0.74,
                    "created_at": "2020-02-26 17:27:09",
                    "discount_amount": 0,
                    "discount_invoiced": 0,
                    "discount_percent": 0,
                    "free_shipping": 0,
                    "discount_tax_compensation_amount": 0,
                    "discount_tax_compensation_invoiced": 0,
                    "is_qty_decimal": 0,
                    "is_virtual": 0,
                    "item_id": 4722,
                    "name": "Aspirator Bulb",
                    "no_discount": 0,
                    "order_id": 3014,
                    "original_price": 7,
                    "price": 7,
                    "price_incl_tax": 7.37,
                    "product_id": 962,
                    "product_type": "simple",
                    "qty_canceled": 0,
                    "qty_invoiced": 2,
                    "qty_ordered": 2,
                    "qty_refunded": 0,
                    "qty_shipped": 2,
                    "quote_item_id": 459,
                    "row_invoiced": 14,
                    "row_total": 14,
                    "row_total_incl_tax": 14.74,
                    "row_weight": 2,
                    "sku": "7017471",
                    "store_id": 1,
                    "tax_amount": 0.74,
                    "tax_invoiced": 0.74,
                    "tax_percent": 5.3,
                    "updated_at": "2020-02-27 21:23:46",
                    "weee_tax_applied": "[]",
                    "weight": 1,
                    "extension_attributes": {
                        "itemized_taxes": [
                            {
                                "tax_item_id": 278,
                                "tax_id": 108,
                                "item_id": 4722,
                                "tax_code": "AVATAX-51",
                                "tax_percent": 4.3,
                                "amount": 0.74,
                                "base_amount": 0.74,
                                "real_amount": 0.6003,
                                "real_base_amount": 0.6003,
                                "taxable_item_type": "product"
                            },
                            {
                                "tax_item_id": 281,
                                "tax_id": 109,
                                "item_id": 4722,
                                "tax_code": "AVATAX-38424",
                                "tax_percent": 1,
                                "amount": 0.74,
                                "base_amount": 0.74,
                                "real_amount": 0.1397,
                                "real_base_amount": 0.1397,
                                "taxable_item_type": "product"
                            }
                        ]
                    }
                },
                {
                    "amount_refunded": 0,
                    "base_amount_refunded": 0,
                    "base_discount_amount": 0,
                    "base_discount_invoiced": 0,
                    "base_discount_tax_compensation_amount": 0,
                    "base_discount_tax_compensation_invoiced": 0,
                    "base_original_price": 52,
                    "base_price": 52,
                    "base_price_incl_tax": 54.76,
                    "base_row_invoiced": 104,
                    "base_row_total": 104,
                    "base_row_total_incl_tax": 109.51,
                    "base_tax_amount": 5.51,
                    "base_tax_invoiced": 5.51,
                    "created_at": "2020-02-26 17:27:09",
                    "discount_amount": 0,
                    "discount_invoiced": 0,
                    "discount_percent": 0,
                    "free_shipping": 0,
                    "discount_tax_compensation_amount": 0,
                    "discount_tax_compensation_invoiced": 0,
                    "is_qty_decimal": 0,
                    "is_virtual": 0,
                    "item_id": 4723,
                    "name": "Box of 10 Smoke Tubes ",
                    "no_discount": 0,
                    "order_id": 3014,
                    "original_price": 52,
                    "price": 52,
                    "price_incl_tax": 54.76,
                    "product_id": 961,
                    "product_type": "simple",
                    "qty_canceled": 0,
                    "qty_invoiced": 2,
                    "qty_ordered": 2,
                    "qty_refunded": 0,
                    "qty_shipped": 2,
                    "quote_item_id": 460,
                    "row_invoiced": 104,
                    "row_total": 104,
                    "row_total_incl_tax": 109.51,
                    "row_weight": 2,
                    "sku": "5100",
                    "store_id": 1,
                    "tax_amount": 5.51,
                    "tax_invoiced": 5.51,
                    "tax_percent": 5.3,
                    "updated_at": "2020-02-27 21:23:46",
                    "weee_tax_applied": "[]",
                    "weight": 1,
                    "extension_attributes": {
                        "itemized_taxes": [
                            {
                                "tax_item_id": 279,
                                "tax_id": 108,
                                "item_id": 4723,
                                "tax_code": "AVATAX-51",
                                "tax_percent": 4.3,
                                "amount": 5.51,
                                "base_amount": 5.51,
                                "real_amount": 4.4697,
                                "real_base_amount": 4.4697,
                                "taxable_item_type": "product"
                            },
                            {
                                "tax_item_id": 282,
                                "tax_id": 109,
                                "item_id": 4723,
                                "tax_code": "AVATAX-38424",
                                "tax_percent": 1,
                                "amount": 5.51,
                                "base_amount": 5.51,
                                "real_amount": 1.0403,
                                "real_base_amount": 1.0403,
                                "taxable_item_type": "product"
                            }
                        ]
                    }
                }
            ],
            "billing_address": {
                "address_type": "billing",
                "city": "Hopewell",
                "company": "Westrock CP",
                "country_id": "US",
                "email": "kent@colonialscientific.com",
                "entity_id": 6028,
                "firstname": "Westrock",
                "lastname": "Hopewell Mill 4505",
                "parent_id": 3014,
                "postcode": "23860",
                "region": "Virginia",
                "region_code": "VA",
                "region_id": 61,
                "street": [
                    "910 Industrial St",
                    "Attn PO: 13127661"
                ],
                "telephone": "804-553-0244"
            },
            "payment": {
                "account_status": null,
                "additional_information": [
                    "Secure Credit Card"
                ],
                "amount_authorized": 142.31,
                "amount_ordered": 142.31,
                "amount_paid": 142.31,
                "base_amount_authorized": 142.31,
                "base_amount_ordered": 142.31,
                "base_amount_paid": 142.31,
                "base_amount_paid_online": 142.31,
                "base_shipping_amount": 18.06,
                "base_shipping_captured": 18.06,
                "cc_exp_month": "9",
                "cc_exp_year": "2021",
                "cc_last4": "7007",
                "cc_type": "AE",
                "entity_id": 3014,
                "last_trans_id": "308236095-capture",
                "method": "paytrace",
                "parent_id": 3014,
                "shipping_amount": 18.06,
                "shipping_captured": 18.06
            },
            "status_histories": [
                {
                    "comment": "571874  Thank you for your order.  The tracking info is \n\n02/27/20  FX GRND PPD            455404981675 ",
                    "created_at": "2020-02-27 21:23:32",
                    "entity_id": 18860,
                    "entity_name": "order",
                    "is_customer_notified": 1,
                    "is_visible_on_front": 0,
                    "parent_id": 3014,
                    "status": "processing"
                },
                {
                    "comment": "Captured amount of $142.31 online. Transaction ID: \"308236095-capture\"",
                    "created_at": "2020-02-27 14:14:42",
                    "entity_id": 18844,
                    "entity_name": "invoice",
                    "is_customer_notified": null,
                    "is_visible_on_front": 0,
                    "parent_id": 3014,
                    "status": "processing"
                },
                {
                    "comment": "Authorized amount of $142.31. Transaction ID: \"308236095\"",
                    "created_at": "2020-02-26 17:27:09",
                    "entity_id": 18838,
                    "entity_name": "order",
                    "is_customer_notified": null,
                    "is_visible_on_front": 0,
                    "parent_id": 3014,
                    "status": "processing"
                }
            ],
            "extension_attributes": {
                "shipping_assignments": [
                    {
                        "shipping": {
                            "address": {
                                "address_type": "shipping",
                                "city": "Hopewell",
                                "company": "Westrock CP",
                                "country_id": "US",
                                "email": "kent@colonialscientific.com",
                                "entity_id": 6027,
                                "firstname": "Westrock",
                                "lastname": "Hopewell Mill 4505",
                                "parent_id": 3014,
                                "postcode": "23860-7826",
                                "region": "Virginia",
                                "region_code": "VA",
                                "region_id": 61,
                                "street": [
                                    "ATTN: Po: 13127661",
                                    "910 Industrial St"
                                ],
                                "telephone": "804-553-0244"
                            },
                            "method": "fedex_FEDEX_GROUND",
                            "total": {
                                "base_shipping_amount": 18.06,
                                "base_shipping_discount_amount": 0,
                                "base_shipping_discount_tax_compensation_amnt": 0,
                                "base_shipping_incl_tax": 18.06,
                                "base_shipping_invoiced": 18.06,
                                "base_shipping_tax_amount": 0,
                                "shipping_amount": 18.06,
                                "shipping_discount_amount": 0,
                                "shipping_discount_tax_compensation_amount": 0,
                                "shipping_incl_tax": 18.06,
                                "shipping_invoiced": 18.06,
                                "shipping_tax_amount": 0
                            }
                        },
                        "items": [
                            {
                                "amount_refunded": 0,
                                "base_amount_refunded": 0,
                                "base_discount_amount": 0,
                                "base_discount_invoiced": 0,
                                "base_discount_tax_compensation_amount": 0,
                                "base_discount_tax_compensation_invoiced": 0,
                                "base_original_price": 7,
                                "base_price": 7,
                                "base_price_incl_tax": 7.37,
                                "base_row_invoiced": 14,
                                "base_row_total": 14,
                                "base_row_total_incl_tax": 14.74,
                                "base_tax_amount": 0.74,
                                "base_tax_invoiced": 0.74,
                                "created_at": "2020-02-26 17:27:09",
                                "discount_amount": 0,
                                "discount_invoiced": 0,
                                "discount_percent": 0,
                                "free_shipping": 0,
                                "discount_tax_compensation_amount": 0,
                                "discount_tax_compensation_invoiced": 0,
                                "is_qty_decimal": 0,
                                "is_virtual": 0,
                                "item_id": 4722,
                                "name": "Aspirator Bulb",
                                "no_discount": 0,
                                "order_id": 3014,
                                "original_price": 7,
                                "price": 7,
                                "price_incl_tax": 7.37,
                                "product_id": 962,
                                "product_type": "simple",
                                "qty_canceled": 0,
                                "qty_invoiced": 2,
                                "qty_ordered": 2,
                                "qty_refunded": 0,
                                "qty_shipped": 2,
                                "quote_item_id": 459,
                                "row_invoiced": 14,
                                "row_total": 14,
                                "row_total_incl_tax": 14.74,
                                "row_weight": 2,
                                "sku": "7017471",
                                "store_id": 1,
                                "tax_amount": 0.74,
                                "tax_invoiced": 0.74,
                                "tax_percent": 5.3,
                                "updated_at": "2020-02-27 21:23:46",
                                "weee_tax_applied": "[]",
                                "weight": 1,
                                "extension_attributes": {
                                    "itemized_taxes": [
                                        {
                                            "tax_item_id": 278,
                                            "tax_id": 108,
                                            "item_id": 4722,
                                            "tax_code": "AVATAX-51",
                                            "tax_percent": 4.3,
                                            "amount": 0.74,
                                            "base_amount": 0.74,
                                            "real_amount": 0.6003,
                                            "real_base_amount": 0.6003,
                                            "taxable_item_type": "product"
                                        },
                                        {
                                            "tax_item_id": 281,
                                            "tax_id": 109,
                                            "item_id": 4722,
                                            "tax_code": "AVATAX-38424",
                                            "tax_percent": 1,
                                            "amount": 0.74,
                                            "base_amount": 0.74,
                                            "real_amount": 0.1397,
                                            "real_base_amount": 0.1397,
                                            "taxable_item_type": "product"
                                        }
                                    ]
                                }
                            },
                            {
                                "amount_refunded": 0,
                                "base_amount_refunded": 0,
                                "base_discount_amount": 0,
                                "base_discount_invoiced": 0,
                                "base_discount_tax_compensation_amount": 0,
                                "base_discount_tax_compensation_invoiced": 0,
                                "base_original_price": 52,
                                "base_price": 52,
                                "base_price_incl_tax": 54.76,
                                "base_row_invoiced": 104,
                                "base_row_total": 104,
                                "base_row_total_incl_tax": 109.51,
                                "base_tax_amount": 5.51,
                                "base_tax_invoiced": 5.51,
                                "created_at": "2020-02-26 17:27:09",
                                "discount_amount": 0,
                                "discount_invoiced": 0,
                                "discount_percent": 0,
                                "free_shipping": 0,
                                "discount_tax_compensation_amount": 0,
                                "discount_tax_compensation_invoiced": 0,
                                "is_qty_decimal": 0,
                                "is_virtual": 0,
                                "item_id": 4723,
                                "name": "Box of 10 Smoke Tubes ",
                                "no_discount": 0,
                                "order_id": 3014,
                                "original_price": 52,
                                "price": 52,
                                "price_incl_tax": 54.76,
                                "product_id": 961,
                                "product_type": "simple",
                                "qty_canceled": 0,
                                "qty_invoiced": 2,
                                "qty_ordered": 2,
                                "qty_refunded": 0,
                                "qty_shipped": 2,
                                "quote_item_id": 460,
                                "row_invoiced": 104,
                                "row_total": 104,
                                "row_total_incl_tax": 109.51,
                                "row_weight": 2,
                                "sku": "5100",
                                "store_id": 1,
                                "tax_amount": 5.51,
                                "tax_invoiced": 5.51,
                                "tax_percent": 5.3,
                                "updated_at": "2020-02-27 21:23:46",
                                "weee_tax_applied": "[]",
                                "weight": 1,
                                "extension_attributes": {
                                    "itemized_taxes": [
                                        {
                                            "tax_item_id": 279,
                                            "tax_id": 108,
                                            "item_id": 4723,
                                            "tax_code": "AVATAX-51",
                                            "tax_percent": 4.3,
                                            "amount": 5.51,
                                            "base_amount": 5.51,
                                            "real_amount": 4.4697,
                                            "real_base_amount": 4.4697,
                                            "taxable_item_type": "product"
                                        },
                                        {
                                            "tax_item_id": 282,
                                            "tax_id": 109,
                                            "item_id": 4723,
                                            "tax_code": "AVATAX-38424",
                                            "tax_percent": 1,
                                            "amount": 5.51,
                                            "base_amount": 5.51,
                                            "real_amount": 1.0403,
                                            "real_base_amount": 1.0403,
                                            "taxable_item_type": "product"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ],
                "payment_additional_info": [
                    {
                        "key": "method_title",
                        "value": "Secure Credit Card"
                    }
                ],
                "applied_taxes": [
                    {
                        "code": "AVATAX-51",
                        "title": "VA STATE TAX",
                        "percent": 4.3,
                        "amount": 5.07,
                        "base_amount": 5.07
                    },
                    {
                        "code": "AVATAX-38424",
                        "title": "VA CITY TAX",
                        "percent": 1,
                        "amount": 1.18,
                        "base_amount": 1.18
                    }
                ],
                "item_applied_taxes": [
                    {
                        "type": "shipping",
                        "applied_taxes": [
                            {
                                "code": "AVATAX-51",
                                "title": "VA STATE TAX",
                                "percent": 4.3,
                                "amount": 0,
                                "base_amount": 0
                            },
                            {
                                "code": "AVATAX-38424",
                                "title": "VA CITY TAX",
                                "percent": 1,
                                "amount": 0,
                                "base_amount": 0
                            }
                        ]
                    },
                    {
                        "type": "product",
                        "item_id": 4722,
                        "applied_taxes": [
                            {
                                "code": "AVATAX-51",
                                "title": "VA STATE TAX",
                                "percent": 4.3,
                                "amount": 0.6003,
                                "base_amount": 0.6003
                            },
                            {
                                "code": "AVATAX-38424",
                                "title": "VA CITY TAX",
                                "percent": 1,
                                "amount": 0.1397,
                                "base_amount": 0.1397
                            }
                        ]
                    },
                    {
                        "type": "product",
                        "item_id": 4723,
                        "applied_taxes": [
                            {
                                "code": "AVATAX-51",
                                "title": "VA STATE TAX",
                                "percent": 4.3,
                                "amount": 4.4697,
                                "base_amount": 4.4697
                            },
                            {
                                "code": "AVATAX-38424",
                                "title": "VA CITY TAX",
                                "percent": 1,
                                "amount": 1.0403,
                                "base_amount": 1.0403
                            }
                        ]
                    }
                ],
                "converting_from_quote": false,
                "taxes": [
                    {
                        "tax_id": 108,
                        "order_id": 3014,
                        "code": "AVATAX-51",
                        "title": "VA STATE TAX",
                        "percent": 4.3,
                        "amount": 6.25,
                        "base_amount": 6.25,
                        "base_real_amount": 5.07,
                        "priority": 0,
                        "position": 0,
                        "process": 0
                    },
                    {
                        "tax_id": 109,
                        "order_id": 3014,
                        "code": "AVATAX-38424",
                        "title": "VA CITY TAX",
                        "percent": 1,
                        "amount": 6.25,
                        "base_amount": 6.25,
                        "base_real_amount": 1.18,
                        "priority": 0,
                        "position": 0,
                        "process": 0
                    }
                ],
                "additional_itemized_taxes": [
                    {
                        "tax_item_id": 280,
                        "tax_id": 108,
                        "tax_code": "AVATAX-51",
                        "tax_percent": 4.3,
                        "amount": 0,
                        "base_amount": 0,
                        "real_amount": 0,
                        "real_base_amount": 0,
                        "taxable_item_type": "shipping"
                    },
                    {
                        "tax_item_id": 283,
                        "tax_id": 109,
                        "tax_code": "AVATAX-38424",
                        "tax_percent": 1,
                        "amount": 0,
                        "base_amount": 0,
                        "real_amount": 0,
                        "real_base_amount": 0,
                        "taxable_item_type": "shipping"
                    }
                ]
            }
        },
) {
  try {
   
    logger.info(`[Magento] Order Record:\n${JSON.stringify(order, null, 2)}`);

    // 1️⃣ Upsert HubSpot Deal/Order
    const upsertedOrder = await upsertHubspotOrder(order);

    if (!upsertedOrder?.id) {
      logger.error(
        `❌ Failed to upsert order External ID: ${JSON.stringify(order?.increment_id)}`,
      );
      return;
    }
    // return; //todo remove after testing

    const dealId = upsertedOrder.id;
    logger.info(`✅ Deal ID: ${JSON.stringify(dealId, null, 2)}`);

    // 2️⃣ Get customer email
    const email = order?.customer_email?.toLowerCase();
    if (!email) {
      logger.warn(
        `⚠️ No customer_email for order ${JSON.stringify(order?.increment_id)}`,
      );
      return;
    }

    logger.info(`🔍 Searching contact for email: ${JSON.stringify(email)}`);

    // 3️⃣ Search contact by email (DO NOT create here)
    const contact = await searchHubspotContactByEmail(email);
    if (!contact?.id) {
      logger.error(
        `❌ Contact not found for email ${JSON.stringify(email)}. Run syncCustomers() first.`,
      );
      return;
    }

    const contactId = contact.id;
    logger.info(`✅ Found Contact ID: ${JSON.stringify(contactId)}`);

    // 4️⃣ Associate Contact ↔ Deal
    const associationResult = await associateContactWithDeal({
      contactId,
      dealId,
    });

    logger.info(
      `Association Result:\n${JSON.stringify(associationResult, null, 2)}`,
    );


    // 5️⃣ Create Line Items + Associate with Deal
    if (order?.items?.length) {
      for (const item of order.items) {

        logger.info(
          `[Magento] Order Item Record:\n${JSON.stringify(item, null, 2)}`,
        );


        // search Product SKU 
        const productInfo = await searchHubspotProductBySku(item.sku);
        logger.info(
          `🔍 Search Product by SKU ${item.sku}:\n${JSON.stringify(productInfo, null, 2)}`,
        );

        
        const payload = mapOrderToLineItems(item,productInfo);
        logger.info(
          `📦 Line Item Payload:\n${JSON.stringify(payload, null, 2)}`,
        );

        const lineItem = await createLineItem(payload);

        if (!lineItem?.id) {
          logger.error("❌ Failed to create line item");
          continue;
        }

        logger.info(`✅ Line Item ID: ${lineItem.id}`);

        const association = await associateLineItemWithDeal({
          lineItemId: lineItem.id,
          dealId,
        });

        logger.info(
          `🔗 LineItem ↔ Deal Association:\n${JSON.stringify(association, null, 2)}`,
        );
      }
    }
    
  } catch (error) {
    logger.error("❌ Error processing Single deal:", error);
  }
}

export { syncOrders, processSingleDeal };
