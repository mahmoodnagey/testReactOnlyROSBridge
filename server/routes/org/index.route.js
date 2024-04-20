let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
const allowedUsers = ["org"]

const authRoutes = require("./auth.route");
const roleRoutes = require("./role.route");
const permissionRoutes = require("./permission.route");
const orgRoutes = require("./org.route");
const userRoutes = require("./user.route");
const robotRoutes = require("./robot.route");
const operationRoutes = require("./operation.route");



app.use(authRoutes)
app.use(checkToken(allowedUsers), orgRoutes);
app.use("/roles", checkToken(allowedUsers), roleRoutes);
app.use("/permissions", checkToken(allowedUsers), permissionRoutes);
app.use("/operations", checkToken(allowedUsers), operationRoutes);
app.use("/users", checkToken(allowedUsers), userRoutes);
app.use("/robots", checkToken(allowedUsers), robotRoutes);


module.exports = app