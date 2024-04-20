const robotRepo = require("../../modules/Robot/robot.repo");


exports.listRobots = async (req, res) => {
    try {
        const filterObject = {...req.query, org: req.tokenData._id, isActive: true};
        if (filterObject.org == "null") filterObject.org = { $exists: false };
        const pageNumber = parseInt(req.query.page) || 1, limitNumber = parseInt(req.query.limit) || 10
        const operationResultObject = await robotRepo.list(filterObject, {}, {}, pageNumber, limitNumber);
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

exports.getRobot = async (req, res) => {
    try {
        const filterObject = {...req.query, org: req.tokenData._id, isActive: true};
        const operationResultObject = await robotRepo.get(filterObject, {});
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