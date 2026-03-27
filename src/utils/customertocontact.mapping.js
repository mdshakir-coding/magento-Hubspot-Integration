



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

// function safeString(value) {
//   if (value === null || value === undefined) return "";
//   if (typeof value === "object") return ""; // prevent object error
//   return String(value).trim();
// }

// function buildCustomerPayload(customer) {
//   const address = customer?.addresses?.[0] || {};

//   return {
//     id: safeString(customer?.id || null),
//     shipping_address_the_same_as_billing_address: safeString(customer?.default_billing || null),
//     shipping_detail: safeString(customer?.default_shipping || null),
//     createdate: safeString(customer?.created_in || null),
    
//     gender: safeString(customer?.gender || null),
//     tax_exempt_certificate: safeString(customer?.taxvat || null),

//     firstname: safeString(customer?.firstname),
//     lastname: safeString(customer?.lastname),
//     email: safeString(customer?.email),


//     phone: safeString(address?.telephone),

//     company: safeString(address?.company),

//     // ✅ street is array in Magento → join
//     address: Array.isArray(address?.street)
//       ? address.street.map(s => safeString(s)).join(" ")
//       : safeString(address?.street),

//     city: safeString(address?.city),

//     // ✅ region can be object → handle properly
//     state: safeString(
//       typeof address?.region === "object"
//         ? address?.region?.region_code
//         : address?.region?.region
//     ),
//     // hs_country_region_code: safeString(address?.region_code),
//     // country_region: safeString(address?.region),


//     zip: safeString(address?.postcode),

//     country: safeString(address?.country_id),

//     fax: safeString(address?.fax),
    
//     // website: safeString(customer?.website), // or any other field you want to map
//     // hs_content_membership_email_confirmed: safeString (customer?.confirmed_email ),
//     // date_of_birth: customer?.dob ? new Date(customer.dob).getTime() : null, // convert to timestamp
    

//   };
// }


function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value).trim();
}


function buildCustomerPayload(customer) {
  const address = customer?.addresses?.[0] || {};

  return {
  
      // id: safeString(customer?.id || null),
    // ✅ FIXED boolean logic
    // shipping_address_the_same_as_billing_address:
      // customer?.default_billing,
      
      shipping_detail: safeString(customer?.default_shipping),

    firstname: safeString(customer?.firstname),
    lastname: safeString(customer?.lastname),
    email: safeString(customer?.email),

    phone: safeString(address?.telephone),
    company: safeString(address?.company),

    address: Array.isArray(address?.street)
      ? address.street.map(s => safeString(s)).join(" ")
      : safeString(address?.street),

    city: safeString(address?.city),

    // ✅ FIXED state handling
    state: safeString(
      typeof address?.region === "object"
        ? address?.region?.region_code
        : address?.region
    ),

    zip: safeString(address?.postcode),
    country: safeString(address?.country_id),

    fax: safeString(address?.fax),

    // ✅ FIXED date (IMPORTANT)
    // website: customer?.created_in,
      

    gender: safeString(customer?.gender),
    tax_exempt_certificate: safeString(customer?.taxvat),
  };
}

export { buildCustomerPayload };