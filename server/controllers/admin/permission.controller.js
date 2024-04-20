const { adminPermissions } = require("../../helpers/adminPermissions.helper")
const { userPermissions } = require("../../helpers/userPermissions.helper")


exports.listAdminPermissions = (req, res) => {
    try {
        const convertedPermissions = {};
        for (const [key, value] of adminPermissions) {
            convertedPermissions[key] = Array.from(value);
        }
        return res.status(200).json({ success: true, code: 200, result: convertedPermissions });
    } catch {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }

}



exports.listUserPermissions = (req, res) => {
    try {
        const convertedPermissions = {};
        for (const [key, value] of userPermissions) {
            convertedPermissions[key] = Array.from(value);
        }
        return res.status(200).json({ success: true, code: 200, result: convertedPermissions });
    } catch {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }

}