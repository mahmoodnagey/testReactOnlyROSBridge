const app = require("express").Router();
const orgController = require("../../controllers/user/org.controller")


app.get("/get", orgController.getOrg);




module.exports = app
