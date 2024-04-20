let express = require("express");
const app = express();

let checkToken = require("../../helpers/jwt.helper").verifyToken;
let { isAuthorizedUser } = require("../../helpers/authorizer.helper")
const allowedUsers = ["user"]

const operationRoutes = require("./operation.route");
const authRoutes = require("./auth.route");
const orgRoutes = require("./org.route");
const robotRoutes = require("./robot.route");
const userRoutes = require("./user.route");



app.use(authRoutes)
app.use(checkToken(allowedUsers), isAuthorizedUser, userRoutes);
app.use("/operations", checkToken(allowedUsers), isAuthorizedUser, operationRoutes);
app.use("/orgs", checkToken(allowedUsers), isAuthorizedUser, orgRoutes);
app.use("/robots", checkToken(allowedUsers), isAuthorizedUser, robotRoutes);

module.exports = app