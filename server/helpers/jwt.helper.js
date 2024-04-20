let jwt = require("jsonwebtoken")
let adminRepo = require("../modules/Admin/admin.repo")
let userRepo = require("../modules/User/user.repo")
let orgRepo = require("../modules/Org/org.repo")


exports.generateToken = (payloadObject, expiryTimeString) => {
    try {
        expiresIn = expiryTimeString ? expiryTimeString : "365d"
        return jwt.sign(payloadObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn })

    } catch (err) {
        console.log(`err.message`, err.message);
        return err.message
    }

}


exports.verifyToken = (roleString) => {
    return (req, res, next) => {
        try {
            let authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(" ")[1]
            if (!token) return res.status(401).json({ success: false, error: "You are not allowed to use this server.", code: 401 })

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, tokenData) => {

                if (err) return res.status(403).json({ success: false, error: "Invalid Token.", code: 403 })

                if (tokenData?.role && !roleString.includes(tokenData.role)) return res.status(401).json({ success: false, error: "You are not allowed to use this server.", code: 401 })


                if (tokenData.role == "admin") {
                    const operationResultObject = await adminRepo.find({ _id: tokenData._id });
                    if (!operationResultObject.success || operationResultObject.result.token != token) return res.status(401).json({ success: false, error: "You are not allowed to use this server.", code: 401 });
                }

                if (tokenData.role == "user") {
                    const operationResultObject = await userRepo.find({ _id: tokenData._id });
                    if (!operationResultObject.success || operationResultObject.result.token != token) return res.status(401).json({ success: false, error: "You are not allowed to use this server.", code: 401 });
                }

                if (tokenData.role == "org") {
                    const operationResultObject = await orgRepo.find({ _id: tokenData._id });
                    if (!operationResultObject.success || operationResultObject.result.token != token) return res.status(401).json({ success: false, error: "You are not allowed to use this server.", code: 401 });
                }


                req.tokenData = tokenData;
                return next();
            })

        } catch (err) {
            console.log(`err.message`, err.message);
            return res.status(500).json({ success: false, error: "Unexpected Error Happened.", code: 401 })
        }
    }

}