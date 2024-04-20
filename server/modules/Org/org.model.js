const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 5;

const orgSchema = mongoose.Schema({
  users: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  robots: [{ type: mongoose.Types.ObjectId, ref: "robots" }],
  name: { type: String },
  email: { type: String, unique: true, drobDups: true },
  password: { type: String },
  isActive: { type: Boolean, default: true },
  role: {
    type: String,
    enum: ["org"],
    default: "org"
  },
  token: { type: String },
  joinDate: { type: Date, default: Date.now() },
})

orgSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, saltrounds);
  next();
})

const orgModel = mongoose.model("orgs", orgSchema)


module.exports = orgModel;