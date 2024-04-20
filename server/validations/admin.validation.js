const joi = require("joi")


module.exports = {

    createAdminValidation: {
        body: joi.object().required().keys({
            name: joi.string().required().messages({
                "string.base": "Please enter a valid name",
                "any.required": "Name is required",
            }),
            email: joi.string().email({ minDomainSegments: 2 }).empty().required()
                .messages({
                    "string.email": "Please enter a valid email",
                    "any.required": "Email is required",
                    "string.empty": "Email cannot be empty.",
                }),
            password: joi.string().empty().required().messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty.",
            }),
            permission: joi.string().required().messages({
                "string.base": "Please enter a valid permission ID",
                "any.required": "Permission ID is required",
            }),
            role: joi.string().valid("superAdmin", "admin").default("admin").optional().messages({
                "any.only": "Valid role is required",
            }),
            isActive: joi.boolean().default(true).optional().messages({
                "boolean.base": "Valid active flag is required",
            }),
        }),
    },

    updateAdminValidation: {
        body: joi.object().optional().keys({
            name: joi.string().optional().messages({
                "string.base": "Please enter a valid name",
            }),
            email: joi.string().email({ minDomainSegments: 2 }).empty().optional()
                .messages({
                    "string.email": "Please enter a valid email",
                    "string.empty": "Email cannot be empty.",
                }),
            password: joi.string().empty().optional().messages({
                "string.base": "Please enter a valid password",
                "string.empty": "Password cannot be empty.",
            }),
            permission: joi.string().optional().messages({
                "string.base": "Please enter a valid permission ID",
            }),
            role: joi.string().valid("superAdmin", "admin").default("admin").optional().messages({
                "any.only": "Valid role is required",
            }),
            isActive: joi.boolean().default(true).optional().messages({
                "boolean.base": "Valid active flag is required",
            }),
        }),
    },

    loginAdminValidation: {
        body: joi.object().required().keys({

            email: joi.string()
                .email({ minDomainSegments: 2 })
                .empty().required()
                .messages({
                    "string.email": "Please enter a valid email",
                    "any.required": "Email is required",
                    "string.empty": "Email cannot be empty.",
                }),

            password: joi.string().empty().required().messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty.",
            })

        })
    },

    resetPasswordAdminValidation: {
        body: joi.object().required().keys({

            email: joi.string().email({ minDomainSegments: 2 }).empty().required().messages({
                "string.email": "Please enter a valid email",
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty.",
            }),

            newPassword: joi.string().empty().required().messages({
                "string.base": "Please enter a valid password",
                "any.required": "Password is required",
                "string.empty": "Password cannot be empty.",
            })

        })
    },

}
