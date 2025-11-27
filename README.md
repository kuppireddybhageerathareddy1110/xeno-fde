
---

# 🚀 Xeno FDE Assignment – Multi-Tenant Shopify Data Ingestion & Insights Platform

This project is built for the **Xeno Forward Deployed Engineer Internship – 2025** assignment.
It simulates how Xeno helps enterprise retailers onboard, integrate, sync, and analyze Shopify store data.

Live Demo Links:

* **Frontend (Vercel):** [https://xeno-fde-eight.vercel.app](https://xeno-fde-eight.vercel.app)
* **Backend (Render):** [https://xeno-fde-32fa.onrender.com](https://xeno-fde-32fa.onrender.com)
* **Database:** Railway MySQL

---

# 📌 Features

### ✔ Multi-Tenant Shopify Integration

* Add Shopify stores as "tenants"
* Store unique Access Token + Shop Domain
* Isolated data per tenant

### ✔ Data Ingestion Service

Fetches and stores:

* Customers
* Orders
* Products

Supports:

* Manual ingestion (`/api/sync/:tenantId`)
* Cron job auto-sync

### ✔ Insights Dashboard (Next.js)

Displays:

* Total customers
* Total orders
* Total revenue
* Orders by date
* Top customers by spend

### ✔ Authentication (Simple Email Auth for Dashboard)

### ✔ Cloud Deployment

* Backend → Render
* Frontend → Vercel
* Database → Railway MySQL
* Supports production environment variables

---

# 🧩 Architecture Diagram

```
      +-----------------------+         +-------------------------+
      |      Shopify Store    |  --->   |  Backend (Express.js)   |
      | (Orders, Products...) |         |  /api/sync /tenants      |
      +-----------------------+         +-------------------------+
                        |                          |
                        |                          v
                        |               +-----------------------+
                        |               |   MySQL (Railway)     |
                        |               |  tenants/customers/...|
                        |               +-----------------------+
                        |
                        v
           +---------------------------+
           | Frontend (Next.js/Vercel) |
           | Dashboard & Analytics     |
           +---------------------------+
```

---

# ⚙️ Tech Stack

### **Backend**

* Node.js
* Express.js
* Prisma ORM
* Axios
* Cron Scheduler

### **Frontend**

* Next.js 16
* React
* Tailwind CSS
* Chart.js / React-Chartjs-2

### **Database**

* MySQL (Railway)

### **Deployment**

* Render (Backend)
* Vercel (Frontend)

---

# 📁 Project Structure

```
xeno-fde/
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── pages/
    ├── styles/
    ├── public/
    ├── .env.local
    └── package.json
```

---

# 🛠 Backend Setup (Local)

### 1. Install dependencies

```
cd backend
npm install
```

### 2. Configure environment variables

Create **backend/.env**:

```
PORT=4000
DATABASE_URL="mysql://YOUR_RAILWAY_DB_URL"
```

### 3. Run migrations

```
npx prisma migrate dev
```

### 4. Start dev server

```
npm run dev
```

---

# 🖥 Frontend Setup (Local)

### 1. Install dependencies

```
cd frontend
npm install
```

### 2. Add env variables

Create **frontend/.env.local**:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Run dev app

```
npm run dev
```

---

# 🌍 Production Deployment

### **Backend (Render)**

Environment variables:

```
PORT=4000
NODE_ENV=production
DATABASE_URL=mysql://<railway-url>
```

Build Command:

```
npm install
npx prisma migrate deploy
```

Start Command:

```
node src/index.js
```

---

### **Frontend (Vercel)**

Environment variable:

```
NEXT_PUBLIC_API_URL=https://xeno-fde-32fa.onrender.com/api
```

Builds automatically via:

```
npm install
npm run build
```

Root Directory:

```
frontend
```

---

# 📡 API Endpoints (Backend)

### **Tenant Management**

```
POST /api/tenants
```

Body:

```json
{
  "name": "Store Name",
  "shopDomain": "example.myshopify.com",
  "accessToken": "shpat_xxxxx"
}
```

---

### **Manual Sync**

```
POST /api/sync/:tenantId
```

Downloads:

* Customers
* Orders
* Products

---

### **Dashboard APIs**

```
GET /api/dashboard/:tenantId/summary
GET /api/dashboard/:tenantId/orders?startDate=...&endDate=...
GET /api/dashboard/:tenantId/top-customers
```

---

# 🧪 Testing the System

### 1. Add a new Shopify tenant

### 2. Click “Sync Now” on dashboard

### 3. Data appears in insights

### 4. Charts & metrics auto-update

---

# ⚠️ Known Limitations

* No OAuth for Shopify App installation (using direct API token only)
* No advanced error handling for rate limits
* No pagination for Shopify responses
* No queue or async processing (can be added with Redis or RabbitMQ)
* Basic dashboard authentication

---

# 🚀 Future Improvements (Production-Ready)

* Shopify OAuth app installation
* Background job queue system
* Caching on top customers, revenue, etc.
* Redis-based incremental sync
* Email-based tenant multi-user support
* Write-behind caching and faster metrics

---

