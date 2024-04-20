const mongoose = require("mongoose");

const operationSchema = mongoose.Schema({
  robot: { type: mongoose.Types.ObjectId, ref: "robots" },
  user: { type: mongoose.Types.ObjectId, ref: "users" },
  org: { type: mongoose.Types.ObjectId, ref: "orgs" },
  area: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date, default: Date.now() },
  pointsLocation: [{
    long: { type: Number, required: true },
    lat: { type: Number, required: true }
  }],
  distance: { type: Number, required: true },
  // battery: { type: Number, required: true },
  runningHours: { type: Number, required: true },
  sealantVolume: { type: Number, required: true },
  cracksNumber: { type: Number, required: true },
  cracksVolume: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  image: [{ type: Object }],
  isActive: { type: Boolean, default: true }
});

const operationModel = mongoose.model("operations", operationSchema);

module.exports = operationModel;
