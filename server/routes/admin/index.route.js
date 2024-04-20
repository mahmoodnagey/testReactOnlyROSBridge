let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
let { isAuthorizedAdmin } = require("../../helpers/authorizer.helper")
const allowedUsers = ["superAdmin", "admin"]

const authRoutes = require("./auth.route");
const adminRoutes = require("./admin.route");
const roleRoutes = require("./role.route");
const permissionRoutes = require("./permission.route");

const orgRoutes = require("./org.route");
const userRoutes = require("./user.route");
const robotRoutes = require("./robot.route");

const operationRoutes = require("./operation.route");



app.use(authRoutes)
app.use(checkToken(allowedUsers), isAuthorizedAdmin, adminRoutes);
app.use("/roles", checkToken(allowedUsers), isAuthorizedAdmin, roleRoutes);
app.use("/permissions", checkToken(allowedUsers), isAuthorizedAdmin, permissionRoutes);
app.use("/operations", checkToken(allowedUsers), isAuthorizedAdmin, operationRoutes);
app.use("/orgs", checkToken(allowedUsers), isAuthorizedAdmin, orgRoutes);
app.use("/users", checkToken(allowedUsers), isAuthorizedAdmin, userRoutes);
app.use("/robots", checkToken(allowedUsers), isAuthorizedAdmin, robotRoutes);


module.exports = app