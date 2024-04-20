const orgRepo = require("../../modules/Org/org.repo");
const userRepo = require("../../modules/User/user.repo");


exports.getOrg = async (req, res) => {
    try {
        let user = await userRepo.find({ _id: req.tokenData._id, isActive: true })
        const filterObject = { _id: user.result.org };
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
