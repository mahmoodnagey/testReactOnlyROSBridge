const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 5;

const adminSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    permission: { type: mongoose.Types.ObjectId, ref: "roles", index: true },
    role: {
        type: String,
        enum: ["superAdmin", "admin"],
        default: "admin"
    },
    token: { type: String },
    isActive: { type: Boolean, default: true },
    joinDate: { type: Date, default: Date.now() },
})

adminSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, saltrounds);
    next();
})

const adminModel = mongoose.model("admins", adminSchema)


module.exports = adminModel;