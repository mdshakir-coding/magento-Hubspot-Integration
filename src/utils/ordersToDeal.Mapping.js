// function buildOrdersPayload(order) {
//   if (!order) return null;

//   return {
//     properties: {
//       // hs_external_order_id: order?.increment_id || null,
//       // hs_billing_address_firstname: order?.customer_firstname || null,
//       // hs_billing_address_lastname: order?.customer_lastname || null,
//       // hs_billing_address_email: order?.customer_email || null,
//       // hs_order_name: order?.items?.[0]?.name || null, // fixed
//       // hs_order_note: order?.customer_note || null,
//       // hs_total_weight: order?.weight || null,
//       // hs_source_store: order?.store_name || null,
//       // discount_amount: order?.base_shipping_discount_amount || null,

//       // // Billing Address
//       // hs_billing_address_street:
//       //   order?.billing_address?.street?.join(", ") || null,
//       // hs_billing_address_city: order?.billing_address?.city || null,
//       // hs_billing_address_state: order?.billing_address?.region || null,
//       // hs_billing_address_postal_code: order?.billing_address?.postcode || null,
//       // hs_billing_address_country: order?.billing_address?.country_id || null,
//       // // hs_billing_address_company: order?.billing_address?.company || null,
//       // hs_billing_address_phone: order?.billing_address?.telephone || null,
//       // hs_billing_address_name:
//       //   order?.billing_address?.firstname && order?.billing_address?.lastname,
//       // // hs_payment_processing_method: order?.billing_address?.payment?.method || null,

//       // // Order totals

//       // // hs_subtotal_price: order?.subtotal || null,

//       // hs_total_price: order?.grand_total || null,

//       // // Order status
//       // hs_external_order_status: order?.status || null,

//       // //  Payment info
//       // hs_payment_processing_method:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.method ?? null,

//       // // Shipping info (if shipping assignments exist)
//       // // hs_shipping_method: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.method || null,
//       // hs_shipping_address_street:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.street?.join(
//       //     ", ",
//       //   ) || null,
//       // hs_shipping_address_city:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.address?.city || null,
//       // hs_shipping_address_state:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.address?.region || null,
//       // hs_shipping_address_postal_code:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.address?.postcode || null,
//       // hs_shipping_address_country:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.address?.country_id || null,
//       // hs_shipping_address_phone:
//       //   order?.extension_attributes?.shipping_assignments?.[0]?.shipping
//       //     ?.address?.telephone || null,

//     },
//   };
// }

function buildOrdersPayload(order) {
  return {
    properties: {
      sourceid: order?.increment_id || null,
      dealname: order?.store_name || null,
      amount: order?.shipping_amount || null,
      pipeline: "884026284", // Set to your desired pipeline

    },
  };
}

export { buildOrdersPayload };
