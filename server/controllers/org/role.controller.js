const roleRepo = require("../../modules/Role/role.repo");


exports.listRoles = async (req, res) => {
    try {
        let filterObject = req.query
        if (!req.query.type || req.query.type !== "user") filterObject = { ...req.query, type: "user" };
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await roleRepo.list(filterObject, {}, {}, pageNumber, limitNumber);
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
        let filterObject = req.query
        if (!req.query.type || req.query.type !== "user") filterObject = { ...req.query, type: "user" };
        const operationResultObject = await roleRepo.get(filterObject, {});
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
