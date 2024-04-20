const app = require("express").Router();
const permissionController = require("../../controllers/org/permission.controller")

app.get("/user/list", permissionController.listUserPermissions);


module.exports = app
