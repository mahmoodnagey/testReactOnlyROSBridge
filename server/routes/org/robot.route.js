const app = require("express").Router();
const robotController = require("../../controllers/org/robot.controller")

app.get("/list", robotController.listRobots);
app.get("/get", robotController.getRobot);


module.exports = app
