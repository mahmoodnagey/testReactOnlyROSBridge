const userRepo = require("../../modules/User/user.repo");
const roleRepo = require("../../modules/Role/role.repo");


exports.createUser = async (req, res) => {
    try {
        const role = await roleRepo.find({ _id: req.body.permission })
        if (!role.success || role.result.type !== "user")
            return res.status(400).json({
                success: false,
                code: 400,
                error: "Invalid permission or permission is not of type user."
            });
        const operationResultObject = await userRepo.create(req.body);
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


exports.listUsers = async (req, res) => {
    try {
        const filterObject = req.query;
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await userRepo.list(filterObject, { password: 0, token: 0 }, {}, pageNumber, limitNumber);
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


exports.getUser = async (req, res) => {
    try {
        const filterObject = req.query;
        const operationResultObject = await userRepo.get(filterObject, { password: 0, token: 0 });
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


exports.updateUser = async (req, res) => {
    try {
        req.body["$unset"] = { token: 1 }
        const operationResultObject = await userRepo.update(req.query._id, req.body);
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

exports.updateUserRole = async (req, res) => {
    try {
        const role = await roleRepo.find({ _id: req.body.permission })
        if (!role.success || role.result.type !== "user")
            return res.status(400).json({
                success: false,
                code: 400,
                error: "Invalid permission or permission is not of type user."
            });
        const operationResultObject = await userRepo.update(req.query._id, { permission: req.body.permission, $unset: { token: 1 } });
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

exports.removeUser = async (req, res) => {
    try {
        const operationResultObject = await userRepo.remove(req.query._id);
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
        const operationResultObject = await userRepo.resetPassword(req.body.email, req.body.newPassword);
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
