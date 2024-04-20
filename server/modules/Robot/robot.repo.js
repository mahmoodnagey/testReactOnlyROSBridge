const robotModel = require("./robot.model");
const orgRepo = require("../Org/org.repo");
const userRepo = require("../User/user.repo");
const { prepareQueryObjects } = require("../../helpers/query.helper")


exports.find = async (filterObject) => {
    try {
        const resultObject = await robotModel.findOne(filterObject).lean();
        if (!resultObject)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };

        return {
            success: true,
            code: 200,
            result: resultObject,
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
    }
};

exports.get = async (filterObject, selectionObject) => {
    try {
        let user = filterObject.user ? filterObject.user : false
        delete filterObject["user"];
        const resultObject = await robotModel
            .findOne(filterObject)
            .lean()
            .populate({ path: "users", select: "name email" })
            .populate({ path: "org", select: "name email" })
            .select(selectionObject);
        if (!resultObject)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        if (user) {
            const userResultObject = await userRepo.find({ _id: user });
            if (!userResultObject.result.robots.some(robotId => robotId.toString() === resultObject._id.toString())) {
                return {
                    success: false,
                    code: 404,
                    error: "No Matching Result Found.",
                };
            }
        }
        return {
            success: true,
            code: 200,
            result: resultObject,
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
    }
};

exports.list = async (filterObject, selectionObject, sortObject, pageNumber, limitNumber) => {
    try {
        let user = filterObject.user ? filterObject.user : false
        delete filterObject["user"];
        let normalizedQueryObjects = await prepareQueryObjects(filterObject, sortObject)
        filterObject = normalizedQueryObjects.filterObject
        sortObject = normalizedQueryObjects.sortObject
        const resultArray = await robotModel.find(filterObject).lean()
            .populate({ path: "users", select: "name email" })
            .populate({ path: "org", select: "name email" })
            .sort(sortObject)
            .select(selectionObject)
        if (!resultArray)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        let robotResultArray = resultArray
        if (user) {
            const userResultObject = await userRepo.find({ _id: user });
            robotResultArray = []
            if (resultArray || resultArray.length !== 0) {
                robotResultArray = resultArray.filter(item => {
                    return userResultObject.result.robots.some(robot => robot.equals(item._id));
                });
            }
        }
        const count = robotResultArray.length;
        robotResultArray = robotResultArray.slice((pageNumber - 1) * limitNumber, (pageNumber - 1) * limitNumber + limitNumber);
        return {
            success: true,
            code: 200,
            result: robotResultArray,
            count,
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
    }
};

exports.create = async (formObject) => {
    try {
        formObject = this.convertToLowerCase(formObject)
        const uniqueObjectResult = await this.isObjectUninque(formObject);
        if (!uniqueObjectResult.success) return uniqueObjectResult
        const resultObject = new robotModel(formObject);
        await resultObject.save();
        if (formObject.org) await orgRepo.updateDirectly(resultObject.org, { $addToSet: { robots: resultObject._id } })
        await resultObject.populate({ path: "org", select: "name" });
        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened.",
            };

        return {
            success: true,
            code: 201,
            result: resultObject,
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
    }
};

exports.update = async (_id, formObject) => {
    try {
        const existingObject = await this.find({ _id });
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        if (formObject.name) {
            formObject.name = formObject.name ? formObject.name : existingObject.result.name;
            const uniqueObjectResult = await this.isNameUnique(formObject, existingObject)
            if (!uniqueObjectResult.success) return uniqueObjectResult
        }
        let users = formObject.users ? formObject.users : []

        if (formObject.org && formObject.org !== (existingObject.result.org).toString()) formObject = { ...formObject, users: users }
        const resultObject = await robotModel.findByIdAndUpdate({ _id }, formObject, {
            new: true, populate: [
                { path: "users", select: "name" },
                { path: "org", select: "name" }
            ]
        })
        if (formObject.org !== (existingObject.result.org).toString()) {
            await orgRepo.updateDirectly(existingObject.result.org, { $pull: { robots: resultObject._id } })
            await orgRepo.updateDirectly(formObject.org, { $addToSet: { robots: resultObject._id } })
            existingObject.result.users.forEach(async (user) => {
                await userRepo.updateDirectly(user, { $pull: { robots: _id } })
            })
        }
        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened."
            };

        return {
            success: true,
            code: 200,
            result: resultObject,
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        };
    }
};

exports.updateDirectly = async (_id, formObject) => {
    try {
        const resultObject = await robotModel.findByIdAndUpdate({ _id }, formObject, { new: true })
        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        return {
            success: true,
            code: 200,
            result: resultObject
        };

    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        };
    }

}

exports.updateMany = async (filterObject, formObject) => {
    try {
        const resultObject = await robotModel.updateMany(filterObject, formObject)
        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        return {
            success: true,
            code: 200,
            result: resultObject
        };

    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        };
    }

}

exports.remove = async (_id) => {
    try {
        const existingObject = await this.find({ _id })
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };

        const resultObject = await robotModel.findByIdAndUpdate({ _id }, { isActive: false })
        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened."
            };
        await orgRepo.updateDirectly(existingObject.result.org, { $pull: { robots: _id } })
        existingObject.result.users.forEach(async (user) => {
            await userRepo.updateDirectly(user, { $pull: { robots: _id } })
        })


        return {
            success: true,
            code: 200,
            result: { message: "Deleted Successfully." },
        };
    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        };
    }
};

exports.isObjectUninque = async (formObject) => {
    const duplicateObject = await this.find({ name: formObject.name })

    if (duplicateObject.success) return {
        success: false,
        code: 409,
        error: "This Name is Already Used."
    }

    return {
        success: true,
        code: 200
    }
}

exports.isNameUnique = async (formObject, existingObject) => {

    const duplicateObject = await this.find({ name: formObject.name });

    if (duplicateObject.success &&
        duplicateObject.result._id.toString() !== existingObject.result._id.toString()) {
        return {
            success: false,
            code: 409,
            error: "This Name is Already Used."
        }
    }

    return {
        success: true,
        code: 200,
    }
}

exports.convertToLowerCase = (formObject) => {
    if (formObject.name) formObject.name = formObject.name.toLowerCase()
    return formObject
}