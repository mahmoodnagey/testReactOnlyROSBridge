const app = require("express").Router();
const permissionController = require("../../controllers/admin/permission.controller")

app.get("/admin/list", permissionController.listAdminPermissions);
app.get("/user/list", permissionController.listUserPermissions);


module.exports = app
