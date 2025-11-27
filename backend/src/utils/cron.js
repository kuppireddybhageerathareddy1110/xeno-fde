const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const { syncCustomers, syncProducts, syncOrders } = require("../services/syncService");

const prisma = new PrismaClient();

function startCron() {
  cron.schedule("*/15 * * * *", async () => {
    console.log("Running scheduled sync...");

    const tenants = await prisma.tenant.findMany();

    for (const tenant of tenants) {
      try {
        await syncCustomers(tenant);
        await syncProducts(tenant);
        await syncOrders(tenant);
      } catch (err) {
        console.log("Sync error:", err.message);
      }
    }
  });
}

module.exports = { startCron };
