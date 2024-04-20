const mongoose = require("mongoose");

const robotSchema = mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  org: { type: mongoose.Types.ObjectId, ref: "orgs" },
  name: { type: String, required: true },
  creationDate: { type: Date, default: Date.now() },
  isActive: { type: Boolean, default: true }
});

const robotModel = mongoose.model("robots", robotSchema);

module.exports = robotModel;
