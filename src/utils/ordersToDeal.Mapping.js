

function buildOrdersPayload(order) {
  if (!order) return null;

  return {
    properties: {
      hs_external_order_id: order?.increment_id || null,
      hs_billing_address_firstname: order?.customer_firstname || null,
      hs_billing_address_lastname: order?.customer_lastname || null,
      hs_billing_address_email: order?.customer_email || null,
      hs_order_name: order?.items?.[0]?.name || null, // fixed


      hs_billing_address_street: order?.billing_address?.street?.join(", ") || null,

    },
  };
}


// function buildOrdersPayload(order) {
//   if (!order) return null;
//     // Ensure we get the correct external ID from Magento order
//   const externalOrderId = order?.increment_id || order?.entity_id || "UNKNOWN_ORDER_ID";



//   // Map all item names as a comma-separated string
//   const allItemNames = order?.items?.map(item => item.name).join(", ") || null;

//   return {
//     properties: {
//       hs_external_order_id: externalOrderId,
//       hs_billing_address_firstname: order?.customer_firstname || null,
//       hs_billing_address_lastname: order?.customer_lastname || null,
//       hs_billing_address_email: order?.customer_email || null,
//       hs_order_name: allItemNames,

//       // Billing Address
//       hs_billing_address_street: order?.billing_address?.street?.join(", ") || null,
//       hs_billing_address_city: order?.billing_address?.city || null,
//       hs_billing_address_state: order?.billing_address?.region || null,
//       hs_billing_address_postalcode: order?.billing_address?.postcode || null,
//       hs_billing_address_country: order?.billing_address?.country_id || null,
//       hs_billing_address_company: order?.billing_address?.company || null,
//       hs_billing_address_phone: order?.billing_address?.telephone || null,

//       // Order totals
//       hs_grand_total: order?.grand_total || null,
//       hs_subtotal: order?.subtotal || null,
//       hs_total_tax: order?.tax_amount || null,
//       hs_total_discount: order?.discount_amount || 0,
//       hs_total_shipping: order?.shipping_amount || 0,

//       // Order status
//       hs_order_status: order?.status || null,
//       hs_order_state: order?.state || null,
//       hs_total_item_count: order?.total_item_count || null,
//       hs_total_qty_ordered: order?.total_qty_ordered || null,
//       hs_total_paid: order?.total_paid || 0,
//       hs_total_refunded: order?.total_refunded || 0,

//       // Payment info
//       hs_payment_method: order?.payment?.method || null,
//     //   hs_cc_type: order?.payment?.cc_type || null,
//     //   hs_cc_last4: order?.payment?.cc_last4 || null,
//     //   hs_cc_owner: order?.payment?.cc_owner || null,

//       // Shipping info (if shipping assignments exist)
//       hs_shipping_method: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.method || null,
//       hs_shipping_street: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.street?.join(", ") || null,
//       hs_shipping_city: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.city || null,
//       hs_shipping_state: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.region || null,
//       hs_shipping_postalcode: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.postcode || null,
//       hs_shipping_country: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.country_id || null,
//     },
//   };
// }



export { buildOrdersPayload };
