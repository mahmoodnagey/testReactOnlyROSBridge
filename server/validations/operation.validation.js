const joi = require("joi")


module.exports = {

    createOperationValidation: {
        body: joi.object().required().keys({
            robot: joi.string().required().messages({
                "string.base": "please enter a valid robot",
                "any.required": "robot is required",
            }),
            user: joi.string().required().messages({
                "string.base": "please enter a valid user",
                "any.required": "user is required",
            }),
            org: joi.string().required().messages({
                "string.base": "please enter a valid org",
                "any.required": "org is required",
            }),
            area: joi.string().required().messages({
                "string.base": "please enter a valid area",
                "any.required": "area is required",
            }),
            startDate: joi.date().optional().messages({
                "date.base": "please enter a valid start date",
            }),
            endDate: joi.date().optional().messages({
                "date.base": "please enter a valid end date",
            }),
            pointsLocation: joi.array().items(joi.object().keys({
                long: joi.number().required().messages({
                    "number.base": "Please enter a valid longitude",
                    "any.required": "Longitude is required",
                }),
                lat: joi.number().required().messages({
                    "number.base": "Please enter a valid latitude",
                    "any.required": "Latitude is required",
                })
            })).optional().messages({
                "array.base": "Valid array of locations is required",
            }),
            distance: joi.number().required().messages({
                "number.base": "please enter a valid distance",
                "any.required": "distance is required",
            }),
            runningHours: joi.number().required().messages({
                "number.base": "please enter a valid running hours",
                "any.required": "running hours is required",
            }),
            sealantVolume: joi.number().required().messages({
                "number.base": "please enter a valid sealant volume",
                "any.required": "sealant volume is required",
            }),
            cracksNumber: joi.number().required().messages({
                "number.base": "please enter a valid cracks number",
                "any.required": "cracks number is required",
            }),
            cracksVolume: joi.number().required().messages({
                "number.base": "please enter a valid cracks volume",
                "any.required": "cracks volume is required",
            }),
            accuracy: joi.number().required().messages({
                "number.base": "please enter a valid accuracy",
                "any.required": "accuracy is required",
            }),
            images: joi.array().items(joi.object()).optional().messages({
                "array.base": "Valid array of images is required.",
            }),
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required.",
            }),
        }),
    },


    updateOperationValidation: {
        body: joi.object().optional().keys({
            robot: joi.string().optional().messages({
                "string.base": "please enter a valid robot",
            }),
            user: joi.string().optional().messages({
                "string.base": "please enter a valid user",
            }),
            org: joi.string().optional().messages({
                "string.base": "please enter a valid org",
            }),
            area: joi.string().optional().messages({
                "string.base": "please enter a valid area",
            }),
            startDate: joi.date().optional().messages({
                "date.base": "please enter a valid start date",
            }),
            endDate: joi.date().optional().messages({
                "date.base": "please enter a valid end date",
            }),
            pointsLocation: joi.array().items(joi.object().keys({
                long: joi.number().required().messages({
                    "number.base": "Please enter a valid longitude",
                }),
                lat: joi.number().required().messages({
                    "number.base": "Please enter a valid latitude",
                })
            })).optional().messages({
                "array.base": "Valid array of locations is required",
            }),
            distance: joi.number().optional().messages({
                "number.base": "please enter a valid distance",
            }),
            runningHours: joi.number().optional().messages({
                "number.base": "please enter a valid running hours",
            }),
            sealantVolume: joi.number().optional().messages({
                "number.base": "please enter a valid sealant volume",
            }),
            cracksNumber: joi.number().optional().messages({
                "number.base": "please enter a valid cracks number",
            }),
            cracksVolume: joi.number().optional().messages({
                "number.base": "please enter a valid cracks volume",
            }),
            accuracy: joi.number().optional().messages({
                "number.base": "please enter a valid accuracy",
            }),
            images: joi.array().items(joi.object()).optional().messages({
                "array.base": "Valid array of images is required.",
            }),
            isActive: joi.boolean().optional().messages({
                "boolean.base": "Valid active flag is required.",
            }),
        })
    }

}
