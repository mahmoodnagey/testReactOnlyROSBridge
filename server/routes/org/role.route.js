const app = require("express").Router();
const roleController = require("../../controllers/org/role.controller")


app.get("/list", roleController.listRoles);
app.get("/get", roleController.getRole);



module.exports = app
