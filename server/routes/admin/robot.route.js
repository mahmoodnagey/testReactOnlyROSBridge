const app = require("express").Router();
const robotController = require("../../controllers/admin/robot.controller")
const { createRobotValidation, updateRobotValidation } = require("../../validations/robot.validation")
const validator = require("../../helpers/validation.helper")

app.post("/create", validator(createRobotValidation), robotController.createRobot);
app.put("/update", validator(updateRobotValidation), robotController.updateRobot);
app.delete("/remove", robotController.removeRobot);

app.get("/list", robotController.listRobots);
app.get("/get", robotController.getRobot);


module.exports = app
