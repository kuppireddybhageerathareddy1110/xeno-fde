const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const tenantRoutes = require("./routes/tenants");
const syncRoutes = require("./routes/sync");
const dashboardRoutes = require("./routes/dashboard");
const { startCron } = require("./utils/cron");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/tenants", tenantRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.send("Xeno FDE Backend Running!"));

// start scheduled sync every 15 min
startCron();

module.exports = app;
