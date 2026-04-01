

function mapOrderToLineItems(item, productInfo) {
  return {
    properties: {

      name: item.name,
      price: item.price,
      quantity: item.qty_ordered,
      hs_product_id: productInfo.id,

    },
  };
}

export { mapOrderToLineItems };





              // base_amount_refunded: 0,
              // base_cost: 0,
              // base_discount_amount: 0,
              // base_discount_invoiced: 0,
              // base_original_price: 172.5,
              // base_price: 172.5,
              // base_price_incl_tax: 172.5,
              // base_row_invoiced: 0,
              // base_row_total: 345,
              // base_row_total_incl_tax: 345,
              // base_tax_amount: 0,
              // base_tax_invoiced: 0,
              // created_at: "2020-02-01 16:44:34",
              // discount_amount: 0,
              // discount_invoiced: 0,
              // discount_percent: 0,
              // free_shipping: 0,
              // is_qty_decimal: 0,
              // is_virtual: 0,
              // item_id: 1068,
              // name: "Battery Pack for GilAir Plus",
              // no_discount: 0,
              // order_id: 654,
              // original_price: 172.5,
              // price: 172.5,
              // price_incl_tax: 172.5,
              // product_id: 973,
              // product_type: "simple",
              // qty_backordered: 0,
              // qty_canceled: 0,
              // qty_invoiced: 2,
              // qty_ordered: 2,
              // qty_refunded: 0,
              // qty_shipped: 2,
              // quote_item_id: 0,
              // row_invoiced: 0,
              // row_total: 345,
              // row_total_incl_tax: 345,
              // row_weight: 0,
              // sku: "783-0012-01-R",
              // store_id: 1,
              // tax_amount: 0,
              // tax_invoiced: 0,
              // tax_percent: 0,
              // updated_at: "2020-02-01 16:44:34",
              // weight: 2,
              // extension_attributes: {
              //   itemized_taxes: [],
              // },


