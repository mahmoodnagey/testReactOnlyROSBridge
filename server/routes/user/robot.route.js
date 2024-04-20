const app = require("express").Router();
const robotController = require("../../controllers/user/robot.controller")

app.get("/get", robotController.getRobot);
app.get("/list", robotController.listRobots);


module.exports = app
