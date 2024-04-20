const app = require("express").Router();
const userController = require("../../controllers/user/user.controller")
const { updateUserValidation, resetPasswordUserValidation } = require("../../validations/user.validation")
const validator = require("../../helpers/validation.helper")


app.put("/update", validator(updateUserValidation), userController.updateUser);
app.put("/password", validator(resetPasswordUserValidation), userController.resetPassword);
app.delete("/remove", userController.removeUser);

app.get("/get", userController.getUser);




module.exports = app
