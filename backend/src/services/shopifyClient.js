const axios = require("axios");

async function shopifyRequest(shopDomain, accessToken, path, params = {}) {
  const version = "2024-04";

  const url = `https://${shopDomain}/admin/api/${version}/${path}`;

  const res = await axios.get(url, {
    headers: {
      "X-Shopify-Access-Token": accessToken
    },
    params
  });

  return res.data;
}

module.exports = { shopifyRequest };
