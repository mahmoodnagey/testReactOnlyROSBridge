const app = require("express").Router();
const operationController = require("../../controllers/admin/operation.controller")
const { createOperationValidation } = require("../../validations/operation.validation")
const validator = require("../../helpers/validation.helper")

app.post("/create", validator(createOperationValidation),operationController.createOperation);

app.get("/listAreas", operationController.listAreas);
app.get("/list", operationController.listOperations);
app.get("/get", operationController.getOperation);


module.exports = app
