let app = require("express").Router();
let adminRoutes = require("./admin/index.route")
let userRoutes = require("./user/index.route")
let orgRoutes = require("./org/index.route")



app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({ success: true, message: "Welcome to Robosealers Server.", code: 200 })
})


app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/org", orgRoutes);


app.all("*", (req, res) => {
    return res.status(404).json({ success: false, error: "Invalid URL.", code: 404 })
})

module.exports = app;
