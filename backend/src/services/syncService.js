const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { shopifyRequest } = require("./shopifyClient");

async function syncCustomers(tenant) {
  const data = await shopifyRequest(tenant.shopDomain, tenant.accessToken, "customers.json", { limit: 250 });
  const customers = data.customers || [];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { id: String(c.id) },
      update: {
        email: c.email,
        firstName: c.first_name,
        lastName: c.last_name
      },
      create: {
        id: String(c.id),
        tenantId: tenant.id,
        email: c.email,
        firstName: c.first_name,
        lastName: c.last_name
      }
    });
  }

  return customers.length;
}

async function syncProducts(tenant) {
  const data = await shopifyRequest(tenant.shopDomain, tenant.accessToken, "products.json", { limit: 250 });
  const products = data.products || [];

  for (const p of products) {
    const price = p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0;

    await prisma.product.upsert({
      where: { id: String(p.id) },
      update: { title: p.title, price },
      create: { id: String(p.id), tenantId: tenant.id, title: p.title, price }
    });
  }

  return products.length;
}

async function syncOrders(tenant) {
  const data = await shopifyRequest(tenant.shopDomain, tenant.accessToken, "orders.json", { status: "any", limit: 250 });
  const orders = data.orders || [];

  for (const o of orders) {
    const amount = parseFloat(o.total_price);

    await prisma.order.upsert({
      where: { id: String(o.id) },
      update: {
        totalPrice: amount,
        customerId: o.customer ? String(o.customer.id) : null,
        createdAt: new Date(o.created_at)
      },
      create: {
        id: String(o.id),
        tenantId: tenant.id,
        customerId: o.customer ? String(o.customer.id) : null,
        totalPrice: amount,
        createdAt: new Date(o.created_at)
      }
    });

    if (o.customer) {
      await prisma.customer.updateMany({
        where: { id: String(o.customer.id), tenantId: tenant.id },
        data: { totalSpent: { increment: amount } }
      });
    }
  }

  return orders.length;
}

module.exports = { syncCustomers, syncProducts, syncOrders };
