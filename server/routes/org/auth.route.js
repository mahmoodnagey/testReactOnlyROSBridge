const app = require("express").Router();
const authController = require("../../controllers/org/auth.controller")
const { loginOrgValidation } = require("../../validations/org.validation")
const validator = require("../../helpers/validation.helper")


app.post("/login", validator(loginOrgValidation), authController.login);




module.exports = app
