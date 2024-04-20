const joi = require("joi")


module.exports = {

    createOrgValidation: {
        body: joi.object().required().keys({
            users: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of user IDs is required",
            }),
            robots: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of robot IDs is required",
            }),
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
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required",
            }),
            role: joi.string().valid("org").optional().messages({
                "any.only": "Valid role is required",
            }),
            joinDate: joi.date().optional().messages({
                "date.base": "Please enter a valid join date",
            }),
        }),
    },

    updateOrgValidation: {
        body: joi.object().optional().keys({
            users: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of user IDs is required",
            }),
            robots: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of robot IDs is required",
            }),
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
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required",
            }),
            role: joi.string().valid("org").optional().messages({
                "any.only": "Valid role is required",
            }),
            joinDate: joi.date().optional().messages({
                "date.base": "Please enter a valid join date",
            }),
        }),
    },

    loginOrgValidation: {
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

    resetPasswordOrgValidation: {
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
