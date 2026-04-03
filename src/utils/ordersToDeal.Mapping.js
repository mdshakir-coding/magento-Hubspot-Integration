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
      // dealname: order?.store_name || null,
      dealname:order?.increment_id || null,
      amount: order?.grand_total || null,
      customer_group:order?.customer_group_id || null,
      pipeline: "884026284", 

      // Customer Mappiing------------------
      customer_firstname:order?.customer_firstname ||null,
      customer_lastname:order?.customer_lastname ||null,
      customer_email:order?.customer_email ||null,

      // Billing Mapping --------------------------
      billing_firstname:order?.billing_address?.firstname || null,
      billing_lastname:order?.billing_address?.lastname || null,
      billing_company:order?.billing_address?.company || null,
      billing_city:order?.billing_address?.city || null,
      billing_region:order?.billing_address?.region || null,
      billing_postcode:order?.billing_address?.postcode || null,
      billing_telephone:order?.billing_address?.telephone || null,
      billing_address:order?.billing_address?.street?.join(", ") || null,
   
     // Shipping Mapping-------------------------
     shipping_firstname:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.firstname || null,
    shipping_lastname:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.lastname || null,
    shipping_company:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.company || null,
    shipping_city: order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.city || null,  
    shipping_region:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.region || null,
    shipping_postcode:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.postcode || null, 
    shipping_telephone:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.telephone || null,
    shipping_address:order?.extension_attributes?.shipping_assignments?.[0]?.shipping?.address?.street?.join(", ") || null,
      
      
      // contact_name:order?.customer_firstname || null,
      // order_subtotal:data?.base_subtotal || null,  // fields error
      // shipping_cost:data?.shipping_amount || null, // fields error
      // associated_contact_email:order?.customer_email || null,
      // refunded_amount:order?.total_invoiced || null, 
      // pickup_location:order?.base_currency_code || null,

    },
  };
}

export { buildOrdersPayload };
