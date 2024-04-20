const app = require("express").Router();
const userController = require("../../controllers/admin/user.controller")
const { createUserValidation, updateUserValidation, resetPasswordUserValidation } = require("../../validations/user.validation")
const validator = require("../../helpers/validation.helper")


app.post("/create", validator(createUserValidation), userController.createUser);
app.put("/update", validator(updateUserValidation), userController.updateUser);
app.put("/role", validator(updateUserValidation), userController.updateUserRole);
app.put("/password", validator(resetPasswordUserValidation), userController.resetPassword);
app.delete("/remove", userController.removeUser);

app.get("/list", userController.listUsers);
app.get("/get", userController.getUser);




module.exports = app
