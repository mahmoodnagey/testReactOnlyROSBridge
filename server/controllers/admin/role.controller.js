const roleRepo = require("../../modules/Role/role.repo");
const adminRepo = require("../../modules/Admin/admin.repo");
const { validateAdminPermissions, validateUserPermissions } = require("../../helpers/authorizer.helper")


exports.createRole = async (req, res) => {
    try {
        let permissionValidationResultObject
        if (req.body.type == "admin") permissionValidationResultObject = validateAdminPermissions(req.body.permissions)
        if (req.body.type == "user") permissionValidationResultObject = validateUserPermissions(req.body.permissions)
        if (!permissionValidationResultObject.success) return res.status(409).json(permissionValidationResultObject);
        const operationResultObject = await roleRepo.create(req.body);
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


exports.listRoles = async (req, res) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await roleRepo.list(req.query, {}, {}, pageNumber, limitNumber);
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


exports.getRole = async (req, res) => {
    try {
        const operationResultObject = await roleRepo.get(req.query, {});
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


exports.updateRole = async (req, res) => {
    try {
        let permissionValidationResultObject
        const role = await roleRepo.find({ _id: req.query._id })
        if(!role.success) return res.status(role.code).json(role);
        if (role.result.type == "admin") permissionValidationResultObject = validateAdminPermissions(req.body.permissions)
        if (role.result.type == "user") permissionValidationResultObject = validateUserPermissions(req.body.permissions)
        if (!permissionValidationResultObject.success) return res.status(409).json(permissionValidationResultObject);
        const operationResultObject = await roleRepo.update(req.query._id, req.body);
        await adminRepo.updateMany({ permission: req.query._id }, { $unset: { token: 1 } })
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


exports.removeRole = async (req, res) => {
    try {
        await adminRepo.updateMany({ permission: req.query._id }, { $unset: { token: 1, permission: 1 } })
        const operationResultObject = await roleRepo.remove(req.query._id);
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
