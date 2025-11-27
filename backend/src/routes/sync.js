const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { syncCustomers, syncProducts, syncOrders } = require("../services/syncService");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/:tenantId/all", async (req, res) => {
  try {
    const tenantId = req.params.tenantId;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const customers = await syncCustomers(tenant);
    const products = await syncProducts(tenant);
    const orders = await syncOrders(tenant);

    res.json({ synced: { customers, products, orders } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
