let userEndPoints = [
    "/user/users/get", "/user/users/update", "/user/users/remove",
    "/user/users/password"
]

let orgEndPoints = [
    "/user/orgs/get"
]

let robotEndPoints = [
    "/user/robots/get", "/user/robots/list"
]

let operationEndPoints = [
    "/user/operations/list", "/user/operations/get",
    "/user/operations/create", "/user/operations/listArea"
]



userEndPoints = new Set(userEndPoints);
orgEndPoints = new Set(orgEndPoints);
robotEndPoints = new Set(robotEndPoints);
operationEndPoints = new Set(operationEndPoints);



let userPermissions = new Map();



userPermissions.set("users", userEndPoints)
userPermissions.set("orgs", orgEndPoints)
userPermissions.set("robots", robotEndPoints)
userPermissions.set("operations", operationEndPoints)

module.exports = { userPermissions }