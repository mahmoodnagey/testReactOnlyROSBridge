const userRepo = require("../../modules/User/user.repo");



exports.getUser = async (req, res) => {
    try {
        if (req.query._id !== req.tokenData._id) return res.status(400).json({
            success: false,
            code: 400,
            error: "You can only manage your own account."
        });
        const operationResultObject = await userRepo.get({ _id: req.query._id }, { password: 0, token: 0 });
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
        if (req.query._id !== req.tokenData._id) return res.status(400).json({
            success: false,
            code: 400,
            error: "You can only manage your own account."
        });
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


exports.removeUser = async (req, res) => {
    try {
        if (req.query._id !== req.tokenData._id) return res.status(400).json({
            success: false,
            code: 400,
            error: "You can only manage your own account."
        });
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
        if (req.body.email !== req.tokenData.email) return res.status(400).json({
            success: false,
            code: 400,
            error: "You can only manage your own account."
        });
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
