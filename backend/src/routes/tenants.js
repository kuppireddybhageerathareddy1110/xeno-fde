const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// create tenant
router.post("/", async (req, res) => {
  try {
    const { name, shopDomain, accessToken } = req.body;

    if (!shopDomain || !accessToken) {
      return res.status(400).json({ error: "shopDomain & accessToken required" });
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: name || shopDomain,
        shopDomain,
        accessToken
      }
    });

    res.json(tenant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// list tenants
router.get("/", async (req, res) => {
  const tenants = await prisma.tenant.findMany();
  res.json(tenants);
});

module.exports = router;
