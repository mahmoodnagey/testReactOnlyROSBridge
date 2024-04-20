const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 5;

const userSchema = mongoose.Schema({
    org: { type: mongoose.Types.ObjectId, ref: "orgs" },
    robots: [{ type: mongoose.Types.ObjectId, ref: "robots" }],
    name: { type: String },
    email: { type: String, unique: true, drobDups: true },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    role: {
        type: String,
        enum: ["user"],
        default: "user"
    },
    token: { type: String },
    joinDate: { type: Date, default: Date.now() },
    permission: { type: mongoose.Types.ObjectId, ref: "roles", index: true }
})

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, saltrounds);
    next();
})

const userModel = mongoose.model("users", userSchema)


module.exports = userModel;