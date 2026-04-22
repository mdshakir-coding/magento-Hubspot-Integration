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
import { associateLineItemWithDeal } from "../services/hubspot.js";
import { searchDealsBySourceId } from "../services/hubspot.js";
import { searchHubspotProductBySku } from "../services/hubspot.js";
import { buildCustomerPayload } from "../utils/customertocontact.mapping.js";

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
    base_grand_total: 226.34,
    base_discount_tax_compensation_amount: 0,
    base_discount_tax_compensation_invoiced: 0,
    base_shipping_amount: 59.39,
    base_shipping_discount_amount: 0,
    base_shipping_discount_tax_compensation_amnt: 0,
    base_shipping_incl_tax: 59.39,
    base_shipping_invoiced: 59.39,
    base_shipping_tax_amount: 0,
    base_subtotal: 157.5,
    base_subtotal_incl_tax: 166.95,
    base_subtotal_invoiced: 157.5,
    base_tax_amount: 9.45,
    base_tax_invoiced: 9.45,
    base_total_due: 0,
    base_total_invoiced: 226.34,
    base_total_invoiced_cost: 0,
    base_total_paid: 226.34,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    billing_address_id: 12158,
    created_at: "2023-01-03 14:06:30",
    customer_email: "nedwards@ecslimited.com",
    customer_firstname: "Nathaniel",
    customer_group_id: 0,
    customer_is_guest: 1,
    customer_lastname: "Edwards",
    customer_note_notify: 0,
    discount_amount: 0,
    discount_invoiced: 0,
    email_sent: 1,
    entity_id: 6080,
    global_currency_code: "USD",
    grand_total: 226.34,
    discount_tax_compensation_amount: 0,
    discount_tax_compensation_invoiced: 0,
    increment_id: "SEN0815202303",
    is_virtual: 0,
    order_currency_code: "USD",
    protect_code: "ccde496165370a43ae373ea88e52d499",
    quote_id: 77838,
    remote_ip: "96.83.99.217",
    shipping_amount: 59.39,
    shipping_description: "Federal Express - Priority Overnight",
    shipping_discount_amount: 0,
    shipping_discount_tax_compensation_amount: 0,
    shipping_incl_tax: 59.39,
    shipping_invoiced: 59.39,
    shipping_tax_amount: 0,
    state: "processing",
    status: "processing",
    store_currency_code: "USD",
    store_id: 1,
    store_name: "Main Website\nMain Website Store\nDefault Store View",
    store_to_base_rate: 0,
    store_to_order_rate: 0,
    subtotal: 157.5,
    subtotal_incl_tax: 166.95,
    subtotal_invoiced: 157.5,
    tax_amount: 9.45,
    tax_invoiced: 9.45,
    total_due: 0,
    total_invoiced: 226.34,
    total_item_count: 2,
    total_paid: 226.34,
    total_qty_ordered: 2,
    updated_at: "2023-01-03 20:03:24",
    weight: 2.7,
    items: [
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_discount_tax_compensation_invoiced: 0,
        base_original_price: 102.5,
        base_price: 102.5,
        base_price_incl_tax: 108.65,
        base_row_invoiced: 102.5,
        base_row_total: 102.5,
        base_row_total_incl_tax: 108.65,
        base_tax_amount: 6.15,
        base_tax_invoiced: 6.15,
        created_at: "2023-01-03 14:06:30",
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        discount_tax_compensation_invoiced: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 9853,
        name: "Air Flow Indicator (HVAC) Kit",
        no_discount: 0,
        order_id: 6080,
        original_price: 102.5,
        price: 102.5,
        price_incl_tax: 108.65,
        product_id: 960,
        product_type: "simple",
        qty_canceled: 0,
        qty_invoiced: 1,
        qty_ordered: 1,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 14774,
        row_invoiced: 102.5,
        row_total: 102.5,
        row_total_incl_tax: 108.65,
        row_weight: 1.7,
        sku: "7014094",
        store_id: 1,
        tax_amount: 6.15,
        tax_invoiced: 6.15,
        tax_percent: 6,
        updated_at: "2023-01-03 20:03:24",
        weee_tax_applied: "[]",
        weight: 1.7,
        extension_attributes: {
          itemized_taxes: [
            {
              tax_item_id: 13871,
              tax_id: 5342,
              item_id: 9853,
              tax_code: "AVATAX-24-Sales",
              tax_percent: 6,
              amount: 6.15,
              base_amount: 6.15,
              real_amount: 6.15,
              real_base_amount: 6.15,
              taxable_item_type: "product",
            },
          ],
        },
      },
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_discount_tax_compensation_invoiced: 0,
        base_original_price: 55,
        base_price: 55,
        base_price_incl_tax: 58.3,
        base_row_invoiced: 55,
        base_row_total: 55,
        base_row_total_incl_tax: 58.3,
        base_tax_amount: 3.3,
        base_tax_invoiced: 3.3,
        created_at: "2023-01-03 14:06:30",
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        discount_tax_compensation_invoiced: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 9854,
        name: "Box of 10 Smoke Tubes ",
        no_discount: 0,
        order_id: 6080,
        original_price: 55,
        price: 55,
        price_incl_tax: 58.3,
        product_id: 961,
        product_type: "simple",
        qty_canceled: 0,
        qty_invoiced: 1,
        qty_ordered: 1,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 14775,
        row_invoiced: 55,
        row_total: 55,
        row_total_incl_tax: 58.3,
        row_weight: 1,
        sku: "5100",
        store_id: 1,
        tax_amount: 3.3,
        tax_invoiced: 3.3,
        tax_percent: 6,
        updated_at: "2023-01-03 20:03:24",
        weee_tax_applied: "[]",
        weight: 1,
        extension_attributes: {
          itemized_taxes: [
            {
              tax_item_id: 13872,
              tax_id: 5342,
              item_id: 9854,
              tax_code: "AVATAX-24-Sales",
              tax_percent: 6,
              amount: 3.3,
              base_amount: 3.3,
              real_amount: 3.3,
              real_base_amount: 3.3,
              taxable_item_type: "product",
            },
          ],
        },
      },
    ],
    billing_address: {
      address_type: "billing",
      city: "COLUMBIA",
      country_id: "US",
      email: "nedwards@ecslimited.com",
      entity_id: 12158,
      firstname: "Nathaniel",
      lastname: "Edwards",
      parent_id: 6080,
      postcode: "21044-4149",
      region: "Maryland",
      region_code: "MD",
      region_id: 31,
      street: ["10616 STEAMBOAT LNDG"],
      telephone: "4104091935",
    },
    payment: {
      account_status: null,
      additional_information: ["Secure Credit Card"],
      amount_authorized: 226.34,
      amount_ordered: 226.34,
      amount_paid: 226.34,
      base_amount_authorized: 226.34,
      base_amount_ordered: 226.34,
      base_amount_paid: 226.34,
      base_amount_paid_online: 226.34,
      base_shipping_amount: 59.39,
      base_shipping_captured: 59.39,
      cc_exp_month: "1",
      cc_exp_year: "2026",
      cc_last4: "1299",
      cc_type: "MC",
      entity_id: 6079,
      last_trans_id: "501491774-capture",
      method: "paytrace",
      parent_id: 6080,
      shipping_amount: 59.39,
      shipping_captured: 59.39,
    },
    status_histories: [
      {
        comment:
          'Captured amount of $226.34 online. Transaction ID: "501491774-capture"',
        created_at: "2023-01-03 20:03:24",
        entity_id: 25080,
        entity_name: "invoice",
        is_customer_notified: null,
        is_visible_on_front: 0,
        parent_id: 6080,
        status: "processing",
      },
      {
        comment: 'Authorized amount of $226.34. Transaction ID: "501491774"',
        created_at: "2023-01-03 14:06:30",
        entity_id: 25071,
        entity_name: "order",
        is_customer_notified: null,
        is_visible_on_front: 0,
        parent_id: 6080,
        status: "processing",
      },
    ],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: "shipping",
              city: "HANOVER",
              company: "ECS Mid-Atlantic",
              country_id: "US",
              email: "nedwards@ecslimited.com",
              entity_id: 12157,
              firstname: "Nathaniel",
              lastname: "Edwards",
              parent_id: 6080,
              postcode: "21076-3117",
              region: "Maryland",
              region_code: "MD",
              region_id: 31,
              street: ["1340 CHARWOOD RD STE B"],
              telephone: "4104091935",
            },
            method: "fedex_PRIORITY_OVERNIGHT",
            total: {
              base_shipping_amount: 59.39,
              base_shipping_discount_amount: 0,
              base_shipping_discount_tax_compensation_amnt: 0,
              base_shipping_incl_tax: 59.39,
              base_shipping_invoiced: 59.39,
              base_shipping_tax_amount: 0,
              shipping_amount: 59.39,
              shipping_discount_amount: 0,
              shipping_discount_tax_compensation_amount: 0,
              shipping_incl_tax: 59.39,
              shipping_invoiced: 59.39,
              shipping_tax_amount: 0,
            },
          },
          items: [
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_discount_tax_compensation_amount: 0,
              base_discount_tax_compensation_invoiced: 0,
              base_original_price: 102.5,
              base_price: 102.5,
              base_price_incl_tax: 108.65,
              base_row_invoiced: 102.5,
              base_row_total: 102.5,
              base_row_total_incl_tax: 108.65,
              base_tax_amount: 6.15,
              base_tax_invoiced: 6.15,
              created_at: "2023-01-03 14:06:30",
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              discount_tax_compensation_amount: 0,
              discount_tax_compensation_invoiced: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 9853,
              name: "Air Flow Indicator (HVAC) Kit",
              no_discount: 0,
              order_id: 6080,
              original_price: 102.5,
              price: 102.5,
              price_incl_tax: 108.65,
              product_id: 960,
              product_type: "simple",
              qty_canceled: 0,
              qty_invoiced: 1,
              qty_ordered: 1,
              qty_refunded: 0,
              qty_shipped: 0,
              quote_item_id: 14774,
              row_invoiced: 102.5,
              row_total: 102.5,
              row_total_incl_tax: 108.65,
              row_weight: 1.7,
              sku: "7014094",
              store_id: 1,
              tax_amount: 6.15,
              tax_invoiced: 6.15,
              tax_percent: 6,
              updated_at: "2023-01-03 20:03:24",
              weee_tax_applied: "[]",
              weight: 1.7,
              extension_attributes: {
                itemized_taxes: [
                  {
                    tax_item_id: 13871,
                    tax_id: 5342,
                    item_id: 9853,
                    tax_code: "AVATAX-24-Sales",
                    tax_percent: 6,
                    amount: 6.15,
                    base_amount: 6.15,
                    real_amount: 6.15,
                    real_base_amount: 6.15,
                    taxable_item_type: "product",
                  },
                ],
              },
            },
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_discount_tax_compensation_amount: 0,
              base_discount_tax_compensation_invoiced: 0,
              base_original_price: 55,
              base_price: 55,
              base_price_incl_tax: 58.3,
              base_row_invoiced: 55,
              base_row_total: 55,
              base_row_total_incl_tax: 58.3,
              base_tax_amount: 3.3,
              base_tax_invoiced: 3.3,
              created_at: "2023-01-03 14:06:30",
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              discount_tax_compensation_amount: 0,
              discount_tax_compensation_invoiced: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 9854,
              name: "Box of 10 Smoke Tubes ",
              no_discount: 0,
              order_id: 6080,
              original_price: 55,
              price: 55,
              price_incl_tax: 58.3,
              product_id: 961,
              product_type: "simple",
              qty_canceled: 0,
              qty_invoiced: 1,
              qty_ordered: 1,
              qty_refunded: 0,
              qty_shipped: 0,
              quote_item_id: 14775,
              row_invoiced: 55,
              row_total: 55,
              row_total_incl_tax: 58.3,
              row_weight: 1,
              sku: "5100",
              store_id: 1,
              tax_amount: 3.3,
              tax_invoiced: 3.3,
              tax_percent: 6,
              updated_at: "2023-01-03 20:03:24",
              weee_tax_applied: "[]",
              weight: 1,
              extension_attributes: {
                itemized_taxes: [
                  {
                    tax_item_id: 13872,
                    tax_id: 5342,
                    item_id: 9854,
                    tax_code: "AVATAX-24-Sales",
                    tax_percent: 6,
                    amount: 3.3,
                    base_amount: 3.3,
                    real_amount: 3.3,
                    real_base_amount: 3.3,
                    taxable_item_type: "product",
                  },
                ],
              },
            },
          ],
        },
      ],
      payment_additional_info: [
        {
          key: "method_title",
          value: "Secure Credit Card",
        },
      ],
      applied_taxes: [
        {
          code: "AVATAX-24-Sales",
          title: "MD STATE TAX",
          percent: 6,
          amount: 9.45,
          base_amount: 9.45,
        },
      ],
      item_applied_taxes: [
        {
          type: "shipping",
          applied_taxes: [
            {
              code: "AVATAX-24-Sales",
              title: "MD STATE TAX",
              percent: 6,
              amount: 0,
              base_amount: 0,
            },
          ],
        },
        {
          type: "product",
          item_id: 9853,
          applied_taxes: [
            {
              code: "AVATAX-24-Sales",
              title: "MD STATE TAX",
              percent: 6,
              amount: 6.15,
              base_amount: 6.15,
            },
          ],
        },
        {
          type: "product",
          item_id: 9854,
          applied_taxes: [
            {
              code: "AVATAX-24-Sales",
              title: "MD STATE TAX",
              percent: 6,
              amount: 3.3,
              base_amount: 3.3,
            },
          ],
        },
      ],
      converting_from_quote: false,
      taxes: [
        {
          tax_id: 5342,
          order_id: 6080,
          code: "AVATAX-24-Sales",
          title: "MD STATE TAX",
          percent: 6,
          amount: 9.45,
          base_amount: 9.45,
          base_real_amount: 9.45,
          priority: 0,
          position: 0,
          process: 0,
        },
      ],
      additional_itemized_taxes: [
        {
          tax_item_id: 13873,
          tax_id: 5342,
          tax_code: "AVATAX-24-Sales",
          tax_percent: 6,
          amount: 0,
          base_amount: 0,
          real_amount: 0,
          real_base_amount: 0,
          taxable_item_type: "shipping",
        },
      ],
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
    // logger.info(`✅ Deal ID: ${JSON.stringify(dealId, null, 2)}`);

    // 2️⃣ Get sourceid
    const sourceid = order?.increment_id;
    if (!sourceid) {
      logger.warn(
        `⚠️ No increment_id for order ${JSON.stringify(order?.increment_id)}`,
      );
      return;
    }

    // 4️⃣ Upsert HubSpot Contact
    const upsertedContact = await upsertHubspotContact(order);
    if (!upsertedContact) {
      logger.error(
        `❌ Failed to upsert contact for email ${JSON.stringify(upsertedContact)}`,
      );
      return;
    }
    const contactId = upsertedContact;
    logger.info(`✅ Contact ID: ${JSON.stringify(contactId, null, 2)}`);

    // 5️⃣ Associate Contact with Deal
    const association = await associateContactWithDeal({ contactId, dealId });
    if (!association) {
      logger.error(
        `❌ Failed to associate contact with deal for order ${JSON.stringify(order?.increment_id)}`,
      );
      return;
    }

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

        const payload = mapOrderToLineItems(item, productInfo);
        logger.info(
          `📦 Line Item Payload:\n${JSON.stringify(payload, null, 2)}`,
        );

        const lineItem = await createLineItem(payload);

        if (!lineItem?.id) {
          logger.error("❌ Failed to create line item");
          continue;
        }

        logger.info(`✅ Line Item ID: ${JSON.stringify(lineItem.id)}`);

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
    logger.error("❌ Error processing  Deal:", error.message);
  }
}

export { syncOrders, processSingleDeal };
