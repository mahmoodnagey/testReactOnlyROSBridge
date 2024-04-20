const orgRepo = require("../../modules/Org/org.repo");

const jwtHelper = require("../../helpers/jwt.helper")


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const operationResultObject = await orgRepo.comparePassword(email, password);

        if (!operationResultObject.success) return res.status(operationResultObject.code).json(operationResultObject)
        if (!operationResultObject.result.isActive)
            return res.status(401).json({ success: false, code: 401, error: "You are not allowed to use this server." })

        payloadObject = {
            _id: operationResultObject.result._id,
            name: operationResultObject.result.name,
            email: operationResultObject.result.email,
            role: operationResultObject.result.role,
        }
        const token = jwtHelper.generateToken(payloadObject, "1d")
        if (operationResultObject.result.role == "org") await orgRepo.updateDirectly(operationResultObject.result._id, { token })
        delete operationResultObject.result["password"]
        delete operationResultObject.result["token"]
        return res.status(operationResultObject.code).json({ token, ...operationResultObject })

    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        });
    }
}
