

function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value).trim();
}

function buildCustomerPayload(customer) {
  const address = customer?.addresses?.[0] || {};

  return {

    shipping_detail: safeString(customer?.default_shipping),

    firstname: safeString(customer?.firstname),
    lastname: safeString(customer?.lastname),
    email: safeString(customer?.email),

    phone: safeString(address?.telephone),
    company: safeString(address?.company),

    address: Array.isArray(address?.street)
      ? address.street.map((s) => safeString(s)).join(" ")
      : safeString(address?.street),

    city: safeString(address?.city),

    // ✅ FIXED state handling
    state: safeString(
      typeof address?.region === "object"
        ? address?.region?.region_code
        : address?.region,
    ),

    zip: safeString(address?.postcode),
    country: safeString(address?.country_id),

    fax: safeString(address?.fax),
    website: safeString(customer?.website_id),

    // account: safeString(customer?.created_in),

    // ✅ FIXED date (IMPORTANT)
    // website: customer?.created_in,

    gender: safeString(customer?.gender),
    tax_exempt_certificate: safeString(customer?.taxvat),
  };
}

export { buildCustomerPayload };
