const operationRepo = require("../../modules/Operation/operation.repo");

exports.createOperation = async (req, res) => {
    try {
        if (!req.body.org || req.body.org !== req.tokenData._id) return res.status(400).json({
            success: false,
            code: 400,
            error: "You can only manage your own robots."
        });
        const resultObject = await operationRepo.create(req.body);
        return res.status(resultObject.code).json(resultObject);
    } catch (err) {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.listOperations = async (req, res) => {
    try {
        const filterObject = { ...req.query, org: req.tokenData._id };
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const resultObject = await operationRepo.list(filterObject, {}, {}, pageNumber, limitNumber);
        return res.status(resultObject.code).json(resultObject);
    } catch (err) {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.listAreas = async (req, res) => {
    try {
        const filterObject = { ...req.query, org: req.tokenData._id };
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const resultObject = await operationRepo.listAreas(filterObject, {}, {}, pageNumber, limitNumber);
        return res.status(resultObject.code).json(resultObject);
    } catch (err) {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}

exports.getOperation = async (req, res) => {
    try {
        const filterObject = { ...req.query, org: req.tokenData._id };
        const resultObject = await operationRepo.get(filterObject, {});
        return res.status(resultObject.code).json(resultObject);
    } catch (err) {
        console.log(`err.message controller`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}
