const { adminPermissions } = require("./adminPermissions.helper")
const { userPermissions } = require("./userPermissions.helper")



exports.validateAdminPermissions = (listOfPermissions) => {
    try {
        for (key in listOfPermissions) {
            if (adminPermissions.get(key)) {
                let allFound = true;
                let permissionErrors = []
                listOfPermissions[key].forEach(permission => {
                    let isFound = false
                    if (adminPermissions.get(key).has(permission)) isFound = true

                    if (!isFound) {
                        permissionErrors.push(`${permission} not found in ${key} permissions`)
                        allFound = false
                    }

                })
                if (!allFound) {
                    allFound = false
                    return {
                        success: false,
                        code: 409,
                        error: permissionErrors
                    }
                }
            }
            else {
                console.log(key, "is not a valid permission")
                return {
                    success: false,
                    code: 409,
                    error: `${key} is not a valid permission!`
                }
            }
        }
        return {
            success: true,
            code: 200
        }
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error!"
        }
    }

}

exports.validateUserPermissions = (listOfPermissions) => {
    try {
        for (key in listOfPermissions) {
            if (userPermissions.get(key)) {
                let allFound = true;
                let permissionErrors = []
                listOfPermissions[key].forEach(permission => {
                    let isFound = false
                    if (userPermissions.get(key).has(permission)) isFound = true

                    if (!isFound) {
                        permissionErrors.push(`${permission} not found in ${key} permissions`)
                        allFound = false
                    }

                })
                if (!allFound) {
                    allFound = false
                    return {
                        success: false,
                        code: 409,
                        error: permissionErrors
                    }
                }
            }
            else {
                console.log(key, "is not a valid permission")
                return {
                    success: false,
                    code: 409,
                    error: `${key} is not a valid permission!`
                }
            }
        }
        return {
            success: true,
            code: 200
        }
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error!"
        }
    }

}

exports.isAuthorizedAdmin = (req, res, next) => {
    try {
        if (req.tokenData) {

            if (req.tokenData?.role == "superAdmin") return next()
            const adminPermissions = req.tokenData.permission || {}
            const endPoint = req.originalUrl.split("?").shift().slice(7);
            let isFound = false
            for (key in adminPermissions) {
                if (adminPermissions[key].includes(endPoint)) { isFound = true; return next(); }
            }

            if (!isFound) return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })

        } else return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })
    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })

    }

}


exports.isAuthorizedUser = (req, res, next) => {
    try {
        if (req.tokenData) {

            const userPermissions = req.tokenData.permission || {}
            const endPoint = req.originalUrl.split("?").shift().slice(7);
            let isFound = false
            for (key in userPermissions) {
                if (userPermissions[key].includes(endPoint)) { isFound = true; return next(); }
            }

            if (!isFound) return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })

        } else return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })
    } catch (err) {
        console.log(`err.message`, err.message);
        return res.status(403).json({ success: false, error: "You are not allowed to use this server.", code: 403 })

    }

}