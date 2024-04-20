const roleModel = require("./role.model")
const adminRepo = require("../Admin/admin.repo")
const userRepo = require("../User/user.repo")
const { prepareQueryObjects } = require("../../helpers/query.helper")


exports.find = async (filterObject) => {
    try {
        const resultObject = await roleModel.findOne(filterObject).lean();
        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        return {
            success: true,
            code: 200,
            result: resultObject
        }

    } catch (err) {
        console.log(`err.message`, err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        }
    }

}


exports.get = async (filterObject, selectionObject) => {
    try {
        const resultObject = await roleModel.findOne(filterObject).lean().select(selectionObject)

        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
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
            error: "Unexpected Error Happened."
        };
    }

}


exports.list = async (filterObject, selectionObject, sortObject, pageNumber, limitNumber) => {
    try {
        let normalizedQueryObjects = await prepareQueryObjects(filterObject, sortObject)
        filterObject = normalizedQueryObjects.filterObject
        sortObject = normalizedQueryObjects.sortObject
        const resultArray = await roleModel.find(filterObject).lean()
            .sort(sortObject)
            .select(selectionObject)
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        if (!resultArray) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        const count = await roleModel.countDocuments(filterObject);
        return {
            success: true,
            code: 200,
            result: resultArray,
            count
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


exports.create = async (formObject) => {
    try {

        formObject = this.convertToLowerCase(formObject)
        const uniqueObjectResult = await this.isObjectUninque(formObject);
        if (!uniqueObjectResult.success) return uniqueObjectResult

        const resultObject = new roleModel(formObject);
        await resultObject.save();

        if (!resultObject) return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        }

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
            error: "Unexpected Error Happened."
        };
    }

}


exports.update = async (_id, formObject) => {
    try {
        const existingObject = await this.find({ _id })
        if (!existingObject.success) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        if (formObject.name) {
            formObject.name = formObject.name ? formObject.name : existingObject.result.name;
            const uniqueObjectResult = await this.isNameUnique(formObject, existingObject)
            if (!uniqueObjectResult.success) return uniqueObjectResult
        }

        const resultObject = await roleModel.findByIdAndUpdate({ _id }, formObject, { new: true })

        if (!resultObject) return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
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


exports.updateDirectly = async (_id, formObject) => {
    try {
        const resultObject = await roleModel.findByIdAndUpdate({ _id }, formObject, { new: true })
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
        const resultObject = await roleModel.findByIdAndDelete({ _id })
        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        await adminRepo.updateMany({ permission: existingObject.result._id }, { $unset: { permission: 1 } })
        await userRepo.updateMany({ permission: existingObject.result._id }, { $unset: { permission: 1 } })

        return {
            success: true,
            code: 200,
            result: { message: "Deleted Successfully." }
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


exports.isObjectUninque = async (formObject) => {
    const duplicateObject = await this.find({ name: formObject.name, type: formObject.type })

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

    const duplicateObject = await this.find({ name: formObject.name, type: existingObject.result.type });

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
