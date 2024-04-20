const joi = require("joi")


module.exports = {

    createRoleValidation: {
        body: joi.object().required().keys({
            name: joi.string().required().messages({
                "string.base": "Please enter a valid role name",
                "any.required": "Role name is required",
            }),
            permissions: joi.object().required().messages({
                "object.base": "Please provide valid permissions",
                "any.required": "Permissions are required",
            }),
            type: joi.string().valid("admin", "user").default("admin").optional().messages({
                "any.only": "Valid type is required",
            }),
        }),
    },

    updateRoleValidation: {
        body: joi.object().optional().keys({
            name: joi.string().optional().messages({
                "string.base": "Please enter a valid role name",
            }),
            permissions: joi.object().optional().messages({
                "object.base": "Please provide valid permissions",
            }),
            type: joi.string().valid("admin", "user").default("admin").optional().messages({
                "any.only": "Valid type is required",
            }),
        }),
    }

}
