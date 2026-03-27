



// Function to build payload for HubSpot
// async function buildCustomerPayload(customer) {
//   return {
//     id: customer?.id || null,
//     firstname: customer?.firstname || null,
//     lastname: customer?.lastname || null,
//     email: customer?.email || null,
//    
    
    


    
    
   
    



    
//   };
// }

function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return ""; // prevent object error
  return String(value).trim();
}

function buildCustomerPayload(customer) {
  const address = customer?.addresses?.[0] || {};

  return {
    email: safeString(customer?.email),
    firstname: safeString(customer?.firstname),
    lastname: safeString(customer?.lastname),

    phone: safeString(address?.telephone),

    company: safeString(address?.company),

    // ✅ street is array in Magento → join
    address: Array.isArray(address?.street)
      ? address.street.map(s => safeString(s)).join(" ")
      : safeString(address?.street),

    city: safeString(address?.city),

    // ✅ region can be object → handle properly
    state: safeString(
      typeof address?.region === "object"
        ? address?.region?.region
        : address?.region
    ),

    zip: safeString(address?.postcode),

    country: safeString(address?.country_id),

    fax: safeString(address?.fax),
  };
}

export { buildCustomerPayload };