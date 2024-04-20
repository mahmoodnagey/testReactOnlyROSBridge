const app = require("express").Router();
const authController = require("../../controllers/admin/auth.controller")
const { loginAdminValidation } = require("../../validations/admin.validation")
const validator = require("../../helpers/validation.helper")


app.post("/login", validator(loginAdminValidation), authController.login);




module.exports = app
