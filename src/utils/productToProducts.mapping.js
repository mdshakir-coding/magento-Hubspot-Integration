function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return "";
  return String(value).trim();
}

// ✅ FIX ADDED
function getCustomAttribute(product, code) {
  const attr = product.custom_attributes?.find(
    (a) => a.attribute_code === code
  );
  return attr ? attr.value : null;
}

function buildProductPayload(product) {
  const description = getCustomAttribute(product, "description");
  const shortDescription = getCustomAttribute(product, "short_description");
  const urlKey = getCustomAttribute(product, "url_key");

  return {
    properties: {
        // hs_object_id: safeString(product.id),
      name: safeString(product.name),
      description: safeString(description || shortDescription),
      price: product.price ? String(product.price) : null,
      hs_sku: safeString(product.sku),
      hs_url: urlKey


      // ⚠️ Only include if exists in HubSpot
      // magento_product_id: safeString(product.id),

    //   product_url: urlKey
    //     ? `https://sensidyne.com/shop/${safeString(urlKey)}`
    //     : "",
    },
  };
}

export { buildProductPayload };