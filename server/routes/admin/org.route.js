const app = require("express").Router();
const orgController = require("../../controllers/admin/org.controller")
const { createOrgValidation, updateOrgValidation, resetPasswordOrgValidation } = require("../../validations/org.validation")
const validator = require("../../helpers/validation.helper")

app.post("/create", validator(createOrgValidation), orgController.createOrg);
app.put("/update", validator(updateOrgValidation), orgController.updateOrg);
app.put("/password", validator(resetPasswordOrgValidation), orgController.resetPassword);
app.delete("/remove", orgController.removeOrg);

app.get("/list", orgController.listOrgs);
app.get("/get", orgController.getOrg);




module.exports = app
