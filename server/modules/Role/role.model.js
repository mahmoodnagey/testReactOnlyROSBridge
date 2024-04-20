const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
    name: { type: String },
    permissions: { type: Object },
    type: {
        type: String,
        enum: ["admin", "user"],
        default: "admin"
    }
})


const roleModel = mongoose.model("roles", roleSchema)


module.exports = roleModel;