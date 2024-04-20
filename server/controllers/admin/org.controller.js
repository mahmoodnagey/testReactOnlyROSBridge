const orgRepo = require("../../modules/Org/org.repo");


exports.createOrg = async (req, res) => {
    try {
        const operationResultObject = await orgRepo.create(req.body);
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


exports.listOrgs = async (req, res) => {
    try {
        const filterObject = req.query;
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await orgRepo.list(filterObject, { password: 0, token: 0 }, {}, pageNumber, limitNumber);
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


exports.getOrg = async (req, res) => {
    try {
        const filterObject = req.query;
        const operationResultObject = await orgRepo.get(filterObject, { password: 0, token: 0 });
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


exports.updateOrg = async (req, res) => {
    try {
        const operationResultObject = await orgRepo.update(req.query._id, req.body);
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


exports.removeOrg = async (req, res) => {
    try {
        const operationResultObject = await orgRepo.remove(req.query._id);
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
        const operationResultObject = await orgRepo.resetPassword(req.body.email, req.body.newPassword);
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
