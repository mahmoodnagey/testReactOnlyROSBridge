const app = require("express").Router();
const authController = require("../../controllers/user/auth.controller")
const { loginUserValidation } = require("../../validations/user.validation")
const validator = require("../../helpers/validation.helper")


app.post("/login", validator(loginUserValidation), authController.login);




module.exports = app
