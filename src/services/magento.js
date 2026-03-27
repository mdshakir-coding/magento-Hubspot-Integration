


import cloudscraper from "cloudscraper";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// 🔐 Your credentials
const consumer = {
  key: "5tuwd2wlyghcb1iqvvrzt39l121ffozp",
  secret: "538pvti44389xnrhow6s8npun0npk53a",
};

const token = {
  key: "6m3nyrmin7flhhy5ro4ew4c9py4cnw1b",
  secret: "bapmzxnvcj187s5378lun6ymgvlc344c",
};

// OAuth setup
const oauth = new OAuth({
  consumer,
  signature_method: "HMAC-SHA256",
  hash_function(base_string, key) {
    return crypto
      .createHmac("sha256", key)
      .update(base_string)
      .digest("base64");
  },
});

async function getMagentoCustomers() {
  const url =
    "https://sensidyne.com/shop/rest/V1/customers/search?searchCriteria=";

  const request_data = {
    url,
    method: "GET",
  };

  // ✅ Generate FULL OAuth header
  const authHeader = oauth.toHeader(
    oauth.authorize(request_data, token)
  );

  try {
    const response = await cloudscraper.get(url, {
      headers: {
        ...authHeader,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept: "application/json",
      },
    });

    const data = JSON.parse(response);

    console.log("✅ Customers:", data);
    return data;
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

export { getMagentoCustomers };




