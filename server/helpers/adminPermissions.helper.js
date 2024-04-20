let adminEndPoints = [
    "/admin/create", "/admin/list", "/admin/get", "/admin/update", "/admin/remove",
    "/admin/password", "/admin/role"
]

let roleEndPoints = [
    "/admin/roles/create", "/admin/roles/list", "/admin/roles/get", "/admin/roles/update",
    "/admin/roles/remove"
]

let permissionEndPoints = [
    "/admin/permissions/admin/list", "/admin/permissions/user/list"
]

let userEndPoints = [
    "/admin/users/list", "/admin/users/get", "/admin/users/update", "/admin/users/remove",
    "/admin/users/create", "/admin/users/password", "/admin/users/role"
]

let orgEndPoints = [
    "/admin/orgs/list", "/admin/orgs/get", "/admin/orgs/update", "/admin/orgs/remove",
    "/admin/orgs/create", "/admin/orgs/password"
]

let robotEndPoints = [
    "/admin/robots/list", "/admin/robots/get", "/admin/robots/update", "/admin/robots/remove",
    "/admin/robots/create"
]

let operationEndPoints = [
    "/admin/operations/list", "/admin/operations/get", "/admin/operations/create", "/admin/operations/listArea"
]



adminEndPoints = new Set(adminEndPoints);
roleEndPoints = new Set(roleEndPoints);
permissionEndPoints = new Set(permissionEndPoints);
userEndPoints = new Set(userEndPoints);
orgEndPoints = new Set(orgEndPoints);
robotEndPoints = new Set(robotEndPoints);
operationEndPoints = new Set(operationEndPoints);



let adminPermissions = new Map();

adminPermissions.set("admins", adminEndPoints)
adminPermissions.set("roles", roleEndPoints)
adminPermissions.set("permissions", permissionEndPoints)
adminPermissions.set("users", userEndPoints)
adminPermissions.set("orgs", orgEndPoints)
adminPermissions.set("robots", robotEndPoints)
adminPermissions.set("operations", operationEndPoints)

module.exports = { adminPermissions }