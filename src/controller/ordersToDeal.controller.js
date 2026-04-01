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
    base_currency_code: "USD",
    base_discount_amount: 0,
    base_discount_invoiced: 0,
    base_grand_total: 359.22,
    base_shipping_amount: 14.22,
    base_shipping_discount_amount: 0,
    base_shipping_incl_tax: 14.22,
    base_shipping_invoiced: 14.22,
    base_shipping_tax_amount: 0,
    base_subtotal: 345,
    base_subtotal_incl_tax: 345,
    base_subtotal_invoiced: 345,
    base_tax_amount: 0,
    base_tax_invoiced: 0,
    base_total_due: 0,
    base_total_invoiced: 359.22,
    base_total_invoiced_cost: 359.22,
    base_total_paid: 359.22,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    billing_address_id: 1307,
    created_at: "2017-10-07 00:34:18",
    customer_email: "taylor.gebben@intertek.com",
    customer_firstname: "Taylor",
    customer_gender: 0,
    customer_group_id: 1,
    customer_id: 689,
    customer_is_guest: 0,
    customer_lastname: "Gebben",
    customer_middlename: "",
    customer_note: "",
    customer_note_notify: 0,
    customer_prefix: "",
    customer_suffix: "",
    customer_taxvat: "",
    discount_amount: 0,
    discount_description: "",
    discount_invoiced: 0,
    email_sent: 1,
    entity_id: 654,
    global_currency_code: "USD",
    grand_total: 359.22,
    hold_before_state: "0",
    hold_before_status: "0",
    increment_id: "108151771",
    is_virtual: 0,
    order_currency_code: "USD",
    shipping_amount: 14.22,
    shipping_description: "Federal Express - Ground",
    shipping_discount_amount: 0,
    shipping_incl_tax: 14.22,
    shipping_invoiced: 14.22,
    shipping_tax_amount: 0,
    state: "complete",
    status: "complete",
    store_currency_code: "USD",
    store_id: 1,
    store_name: "Main Website\nMain Website Store\nDefault Store View",
    store_to_base_rate: 1,
    store_to_order_rate: 1,
    subtotal: 345,
    subtotal_incl_tax: 345,
    subtotal_invoiced: 345,
    tax_amount: 0,
    tax_invoiced: 0,
    total_due: 0,
    total_invoiced: 359.22,
    total_item_count: 1,
    total_paid: 359.22,
    total_qty_ordered: 1,
    updated_at: "2022-08-25 22:01:09",
    weight: 4,
    items: [
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_cost: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_original_price: 172.5,
        base_price: 172.5,
        base_price_incl_tax: 172.5,
        base_row_invoiced: 0,
        base_row_total: 345,
        base_row_total_incl_tax: 345,
        base_tax_amount: 0,
        base_tax_invoiced: 0,
        created_at: "2020-02-01 16:44:34",
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 1068,
        name: "Battery Pack for GilAir Plus",
        no_discount: 0,
        order_id: 654,
        original_price: 172.5,
        price: 172.5,
        price_incl_tax: 172.5,
        product_id: 973,
        product_type: "simple",
        qty_backordered: 0,
        qty_canceled: 0,
        qty_invoiced: 2,
        qty_ordered: 2,
        qty_refunded: 0,
        qty_shipped: 2,
        quote_item_id: 0,
        row_invoiced: 0,
        row_total: 345,
        row_total_incl_tax: 345,
        row_weight: 0,
        sku: "783-0012-01-R",
        store_id: 1,
        tax_amount: 0,
        tax_invoiced: 0,
        tax_percent: 0,
        updated_at: "2020-02-01 16:44:34",
        weight: 2,
        extension_attributes: {
          itemized_taxes: [],
        },
      },
    ],
    billing_address: {
      address_type: "billing",
      city: "Kentwood",
      company: "Intertek",
      country_id: "US",
      customer_id: 689,
      email: "taylor.gebben@intertek.com",
      entity_id: 1307,
      fax: "",
      firstname: "Jesse",
      lastname: "Ondersma",
      parent_id: 654,
      postcode: "49512",
      region: "Michigan",
      region_code: "MI",
      region_id: 33,
      street: ["4700 Broadmoor Ave , Suite 200"],
      telephone: "(616) 656-7401",
    },
    payment: {
      account_status: null,
      additional_information: [],
      cc_exp_month: "0",
      cc_exp_year: "0",
      cc_last4: "",
      cc_number_enc: "",
      cc_owner: "",
      cc_ss_start_month: "0",
      cc_ss_start_year: "0",
      cc_type: "",
      entity_id: 654,
      method: "paytrace",
      parent_id: 654,
      po_number: "",
    },
    status_histories: [
      {
        comment: "",
        created_at: "2017-10-11 16:25:22",
        entity_id: 4365,
        is_customer_notified: 0,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "complete",
      },
      {
        comment:
          "545558\n\nTHANK YOU FOR YOUR ORDER.  This has shipped   tracking info is \n\n10/10/17  FX GRND PPD            654430497324 ",
        created_at: "2017-10-11 16:25:06",
        entity_id: 4364,
        is_customer_notified: 1,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "processing",
      },
      {
        comment: "Captured amount of $359.22 online.",
        created_at: "2017-10-10 21:42:56",
        entity_id: 4363,
        is_customer_notified: 1,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "processing",
      },
      {
        comment:
          'Credit Card: xxxx-5583 amount $359.22 capture - successful. Authorize.Net Transaction ID 178406865.  Transaction ID: "178406865-capture".',
        created_at: "2017-10-10 21:42:56",
        entity_id: 4362,
        is_customer_notified: 0,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "processing",
      },
      {
        comment: "Authorized amount of $359.22.",
        created_at: "2017-10-07 00:34:21",
        entity_id: 4361,
        is_customer_notified: 1,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "processing",
      },
      {
        comment:
          'Credit Card: xxxx-5583 amount $359.22 authorize - successful. Authorize.Net Transaction ID 178406865.  Transaction ID: "178406865".',
        created_at: "2017-10-07 00:34:21",
        entity_id: 4360,
        is_customer_notified: 0,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "0",
      },
      {
        comment:
          "<br><b>Payment method:</b> mp_paytrace<br><b>Shipping method:</b> Federal Express - Ground<br><b>Order was placed using:</b> USD<br><b>CC Type:</b> Visa<br><b>CC Number:</b> XXXX-5583<br><b>CC Expiration Date:</b> 6/2018<br><b>Processed Amount:</b> 359.22",
        created_at: "2017-10-07 00:34:18",
        entity_id: 4366,
        is_customer_notified: 0,
        is_visible_on_front: 0,
        parent_id: 654,
        status: "complete",
      },
    ],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: "shipping",
              city: "Kentwood",
              company: "Intertek",
              country_id: "US",
              customer_id: 689,
              email: "taylor.gebben@intertek.com",
              entity_id: 1308,
              fax: "",
              firstname: "Taylor",
              lastname: "Gebben",
              parent_id: 654,
              postcode: "49512",
              region: "Michigan",
              region_code: "MI",
              region_id: 33,
              street: ["4700 Broadmoor Ave , Suite 200"],
              telephone: "(616) 656-7401",
            },
            method: "fedex_fedex",
            total: {
              base_shipping_amount: 14.22,
              base_shipping_discount_amount: 0,
              base_shipping_incl_tax: 14.22,
              base_shipping_invoiced: 14.22,
              base_shipping_tax_amount: 0,
              shipping_amount: 14.22,
              shipping_discount_amount: 0,
              shipping_incl_tax: 14.22,
              shipping_invoiced: 14.22,
              shipping_tax_amount: 0,
            },
          },
          items: [
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_cost: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_original_price: 172.5,
              base_price: 172.5,
              base_price_incl_tax: 172.5,
              base_row_invoiced: 0,
              base_row_total: 345,
              base_row_total_incl_tax: 345,
              base_tax_amount: 0,
              base_tax_invoiced: 0,
              created_at: "2020-02-01 16:44:34",
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 1068,
              name: "Battery Pack for GilAir Plus",
              no_discount: 0,
              order_id: 654,
              original_price: 172.5,
              price: 172.5,
              price_incl_tax: 172.5,
              product_id: 973,
              product_type: "simple",
              qty_backordered: 0,
              qty_canceled: 0,
              qty_invoiced: 2,
              qty_ordered: 2,
              qty_refunded: 0,
              qty_shipped: 2,
              quote_item_id: 0,
              row_invoiced: 0,
              row_total: 345,
              row_total_incl_tax: 345,
              row_weight: 0,
              sku: "783-0012-01-R",
              store_id: 1,
              tax_amount: 0,
              tax_invoiced: 0,
              tax_percent: 0,
              updated_at: "2020-02-01 16:44:34",
              weight: 2,
              extension_attributes: {
                itemized_taxes: [],
              },
            },
          ],
        },
      ],
      payment_additional_info: [],
      applied_taxes: [],
      item_applied_taxes: [],
      converting_from_quote: false,
      taxes: [],
      additional_itemized_taxes: [],
    },
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

    logger.info(`🔍 Searching contact for email: ${email}`);

    // 3️⃣ Search contact by email (DO NOT create here)
    const contact = await searchHubspotContactByEmail(email);
    if (!contact?.id) {
      logger.error(
        `❌ Contact not found for email ${email}. Run syncCustomers() first.`,
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
