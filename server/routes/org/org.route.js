const app = require("express").Router();
const orgController = require("../../controllers/org/org.controller")
const { updateOrgValidation, resetPasswordOrgValidation } = require("../../validations/org.validation")
const validator = require("../../helpers/validation.helper")

app.put("/update", validator(updateOrgValidation), orgController.updateOrg);
app.put("/password", validator(resetPasswordOrgValidation), orgController.resetPassword);
app.delete("/remove", orgController.removeOrg);

app.get("/get", orgController.getOrg);




module.exports = app
