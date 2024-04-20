const app = require("express").Router();
const adminController = require("../../controllers/admin/admin.controller")
const { createAdminValidation, updateAdminValidation, resetPasswordAdminValidation } = require("../../validations/admin.validation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createAdminValidation), adminController.createAdmin);
app.put("/update", validator(updateAdminValidation), adminController.updateAdmin);
app.put("/role", validator(updateAdminValidation), adminController.updateAdminRole);
app.put("/password", validator(resetPasswordAdminValidation), adminController.resetPassword);
app.delete("/remove", adminController.removeAdmin);

app.get("/list", adminController.listAdmins);
app.get("/get", adminController.getAdmin);




module.exports = app
