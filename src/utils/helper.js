function cleanProps(obj) {
  const cleaned = {};

  for (const key in obj) {
    const value = obj[key];

    // Skip undefined
    if (value === undefined) continue;

    // Allow null (HubSpot accepts null for some fields)
    if (value === null) {
      cleaned[key] = null;
      continue;
    }

    // Allow strings and numbers directly
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      cleaned[key] = value;
      continue;
    }

    // If it's an object and has `.toString()`
    if (typeof value === "object") {
      // Capsule rich text: { content: "xxx" }
      if (value.content && typeof value.content === "string") {
        cleaned[key] = value.content;
        continue;
      }

      // Date object → convert to timestamp
      if (value instanceof Date) {
        cleaned[key] = value.getTime();
        continue;
      }

      // Otherwise fallback → JSON string
      cleaned[key] = JSON.stringify(value);
      continue;
    }

    // Everything else → convert to string
    cleaned[key] = String(value);
  }

  return cleaned;
}

function transformRecordToMagentoOrder(input) {
  // 1. Parse dates (converts "1/6/23 12:57" to "2023-01-06 12:57:00")
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(" ");
    let [month, day, year] = datePart.split("/");
    year = year.length === 2 ? `20${year}` : year;
    month = month.padStart(2, "0");
    day = day.padStart(2, "0");
    return `${year}-${month}-${day} ${timePart}:00`;
  };

  const createdAt = formatDate(input["Created At"]);

  // 2. Extract and format items dynamically
  const items = [];
  let subtotal = 0;
  let totalQty = 0;

  for (let i = 1; i <= 5; i++) {
    const name = input[`item ${i}(Name)`];
    if (name && name.trim() !== "") {
      const price = parseFloat(input[`item ${i}(Price)`] || 0);
      const qty = parseInt(input[`item ${i}(Qty Ordered)`] || 0, 10);
      const rowTotal = price * qty;

      subtotal += rowTotal;
      totalQty += qty;

      items.push({
        name: name,
        sku: input[`item ${i}(Sku)`],
        price: price,
        base_price: price,
        original_price: price,
        qty_ordered: qty,
        qty_invoiced: qty, // Assuming full invoice
        row_total: rowTotal,
        base_row_total: rowTotal,
        product_type: "simple",
        created_at: createdAt,
        updated_at: createdAt,
        // Defaulting missing item fields to 0
        tax_amount: 0,
        base_tax_amount: 0,
        discount_amount: 0,
        amount_refunded: 0,
      });
    }
  }

  // 3. Define totals (Defaulting missing shipping/tax from input to 0)
  const shippingAmount = 0;
  const taxAmount = 0;
  const grandTotal = subtotal + shippingAmount + taxAmount;

  // 4. Construct the deeply nested order object
  return {
    increment_id: input["Increment Id"],
    created_at: createdAt,
    updated_at: createdAt,
    state: "processing",
    status: "processing",

    // Customer Info
    customer_email: input["Customer Email"],
    customer_firstname: input["Customer Firstname"],
    customer_lastname: input["Customer Lastname"],
    customer_is_guest: input["Customer Id"] ? 0 : 1,

    // Totals & Currency
    base_currency_code: "USD",
    order_currency_code: "USD",
    global_currency_code: "USD",
    store_currency_code: "USD",

    subtotal: subtotal,
    base_subtotal: subtotal,
    grand_total: grandTotal,
    base_grand_total: grandTotal,
    total_paid: grandTotal,
    base_total_paid: grandTotal,
    total_qty_ordered: totalQty,
    total_item_count: items.length,

    shipping_amount: shippingAmount,
    base_shipping_amount: shippingAmount,
    tax_amount: taxAmount,
    base_tax_amount: taxAmount,
    discount_amount: 0,

    // Arrays & Nested Objects
    items: items,

    billing_address: {
      address_type: "billing",
      firstname: input["Billing Firstname"],
      lastname: input["Billing Lastname"],
      company: input["Billing Company"],
      city: input["Billing City"],
      region: input["Billing Region"],
      postcode: input["Billing Postcode"],
      telephone: input["Billing Telephone"],
      country_id: "US", // Defaulting to US, map dynamically if you have country code
    },

    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: "shipping",
              firstname: input["Shipping Firstname"],
              lastname: input["Shipping Lastname"],
              company: input["Shipping Company"],
              city: input["Shipping City"],
              region: input["Shipping Region"],
              postcode: input["Shipping Postcode"],
              telephone: input["Shipping Telephone"],
              country_id: "US", // Defaulting to US
            },
            method: "standard_standard", // Placeholder method
            total: {
              shipping_amount: shippingAmount,
              base_shipping_amount: shippingAmount,
            },
          },
          items: items, // Magento duplicates items in shipping assignments
        },
      ],
    },

    payment: {
      method: "unknown", // Input lacks payment gateway info
      amount_ordered: grandTotal,
      amount_paid: grandTotal,
    },
  };
}

export { cleanProps, transformRecordToMagentoOrder };
