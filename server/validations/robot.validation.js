const joi = require("joi")


module.exports = {

    createRobotValidation: {
        body: joi.object().required().keys({
            users: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of user IDs is required",
            }),
            org: joi.string().optional().messages({
                "string.base": "Please enter a valid organization ID",
            }),
            name: joi.string().required().messages({
                "string.base": "please enter a valid name",
                "any.required": "name is required",
            }),
            creationdate: joi.date().optional().messages({
                "date.base": "please enter a valid creation date",
            }),
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required.",
            }),
        }),
    },


    updateRobotValidation: {
        body: joi.object().optional().keys({
            users: joi.array().items(joi.string()).optional().messages({
                "array.base": "Valid array of user IDs is required",
            }),
            org: joi.string().optional().messages({
                "string.base": "Please enter a valid organization ID",
            }),
            name: joi.string().optional().messages({
                "string.base": "please enter a valid name",
            }),
            creationdate: joi.date().optional().messages({
                "date.base": "please enter a valid creation date",
            }),
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required.",
            }),
        })
    }
    
}
