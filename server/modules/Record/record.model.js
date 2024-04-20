const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  batteryHours: {
    type: Number,
    required: true
  },
  areaDistance: {
    type: Number,
    required: true
  },
  accuracyPercentage: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
});

const recordModel = mongoose.model('records', recordSchema);

module.exports = recordModel;