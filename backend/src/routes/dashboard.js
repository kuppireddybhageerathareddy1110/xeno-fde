const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:tenantId/summary", async (req, res) => {
  const tenantId = req.params.tenantId;

  const totalCustomers = await prisma.customer.count({ where: { tenantId } });
  const totalOrders = await prisma.order.count({ where: { tenantId } });

  const amount = await prisma.order.aggregate({
    where: { tenantId },
    _sum: { totalPrice: true }
  });

  res.json({
    totalCustomers,
    totalOrders,
    totalRevenue: amount._sum.totalPrice || 0
  });
});

router.get("/:tenantId/ordersByDate", async (req, res) => {
  const tenantId = req.params.tenantId;

  const orders = await prisma.order.findMany({
    where: { tenantId }
  });

  const grouped = {};
  orders.forEach(order => {
    const date = order.createdAt.toISOString().substring(0, 10);
    grouped[date] = (grouped[date] || 0) + order.totalPrice;
  });

  res.json(grouped);
});

router.get("/:tenantId/topCustomers", async (req, res) => {
  const tenantId = req.params.tenantId;

  const top = await prisma.customer.findMany({
    where: { tenantId },
    orderBy: { totalSpent: "desc" },
    take: 5
  });

  res.json(top);
});

module.exports = router;
