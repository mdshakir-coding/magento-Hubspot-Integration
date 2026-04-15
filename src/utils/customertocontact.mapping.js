

function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value).trim();
}

function buildCustomerPayload(customer) {
  const address = customer?.addresses?.[0] || {};

  return {

    // shipping_detail: safeString(customer?.default_shipping),

    firstname: safeString(customer?.customer_firstname),
    lastname: safeString(customer?.customer_lastname),
    email: safeString(customer?.customer_email),
 
    phone: safeString(customer?.billing_address?.telephone),
    company: safeString(customer?.billing_address?.company),
    address: safeString(customer?.billing_address?.street),
    city: safeString(customer?.billing_address?.city),
    state: safeString(customer?.billing_address?.region),
    zip: safeString(customer?.billing_address?.postcode),
    country: safeString(customer?.billing_address?.country_id),

    // address: Array.isArray(address?.street)
    //   ? address.street.map((s) => safeString(s)).join(" ")
    //   : safeString(address?.street),

    // city: safeString(billing_address?.city),

    // // ✅ FIXED state handling
    // state: safeString(
    //   typeof address?.region === "object"
    //     ? address?.region?.region_code
    //     : address?.region,
    // ),

    // zip: safeString(address?.postcode),
    // country: safeString(address?.country_id),

    // fax: safeString(address?.fax),
    // website: safeString(customer?.website_id),

    // gender: safeString(customer?.gender),
    // tax_exempt_certificate: safeString(customer?.taxvat),
  };
}





export { buildCustomerPayload };
