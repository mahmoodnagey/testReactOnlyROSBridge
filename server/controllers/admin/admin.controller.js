const adminRepo = require("../../modules/Admin/admin.repo");
const roleRepo = require("../../modules/Role/role.repo");


exports.createAdmin = async (req, res) => {
    try {
        const role = await roleRepo.find({ _id: req.body.permission })
        if (!role.success || role.result.type !== "admin")
            return res.status(400).json({
                success: false,
                code: 400,
                error: "Invalid permission or permission is not of type admin."
            });
        const operationResultObject = await adminRepo.create(req.body);
        if (operationResultObject.success) delete operationResultObject.result.password;
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }

}

exports.listAdmins = async (req, res) => {
    try {
        const filterObject = req.query;
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await adminRepo.list(filterObject, { password: 0, token: 0 }, {}, pageNumber, limitNumber);
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.getAdmin = async (req, res) => {
    try {
        const filterObject = req.query;
        const operationResultObject = await adminRepo.get(filterObject, { password: 0, token: 0 });
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.updateAdminRole = async (req, res) => {
    try {
        const role = await roleRepo.find({ _id: req.body.permission })
        if (!role.success || role.result.type !== "admin")
            return res.status(400).json({
                success: false,
                code: 400,
                error: "Invalid permission or permission is not of type admin."
            });

        const operationResultObject = await adminRepo.update(req.query._id, { permission: req.body.permission, $unset: { token: 1 } });
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.updateAdmin = async (req, res) => {
    try {
        const operationResultObject = await adminRepo.update(req.query._id, req.body);
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.removeAdmin = async (req, res) => {
    try {
        let existingObject = await adminRepo.find({ _id: req.query._id })
        if (!existingObject.success) return res.status(existingObject.code).json(existingObject)
        if (req.tokenData.role == "admin" && existingObject.result.role == "superAdmin") return res.status(403).json({
            success: false,
            code: 403,
            error: "You are not allowed to use this server."
        });

        const operationResultObject = await adminRepo.remove(existingObject.result._id);
        return res.status(operationResultObject.code).json(operationResultObject);
    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const operationResultObject = await adminRepo.resetPassword(req.body.email, req.body.newPassword);
        return res.status(operationResultObject.code).json(operationResultObject);

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }

}
