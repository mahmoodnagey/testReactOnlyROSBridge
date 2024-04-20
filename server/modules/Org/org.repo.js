const bcrypt = require("bcrypt");
const orgModel = require("./org.model")
const robotRepo = require("../Robot/robot.repo")
const userRepo = require("../User/user.repo")
const { prepareQueryObjects } = require("../../helpers/query.helper")
const saltrounds = 5;

exports.find = async (filterObject) => {
    try {
        const resultObject = await orgModel.findOne(filterObject).lean();
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
        const resultObject = await orgModel.findOne(filterObject).lean()
            .populate({ path: "users", select: "name email" })
            .populate({ path: "robots", select: "name" })
            .select(selectionObject);
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

exports.list = async (filterObject, selectionObject, sortObject, pageNumber, limitNumber) => {
    try {
        let normalizedQueryObjects = await prepareQueryObjects(filterObject, sortObject)
        filterObject = normalizedQueryObjects.filterObject
        sortObject = normalizedQueryObjects.sortObject
        const resultArray = await orgModel.find(filterObject).lean()
            .populate({ path: "users", select: "name email" })
            .populate({ path: "robots", select: "name" })
            .sort(sortObject)
            .select(selectionObject)
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        if (!resultArray)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        const count = await orgModel.countDocuments(filterObject);
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
            error: "Unexpected Error Happened.",
        };
    }
};

exports.create = async (formObject) => {
    try {
        formObject = this.convertToLowerCase(formObject)
        const uniqueObjectResult = await this.isObjectUninque(formObject);
        if (!uniqueObjectResult.success) return uniqueObjectResult
        const resultObject = new orgModel(formObject);
        await resultObject.save();;
        if (formObject.robots) {
            resultObject.robots.forEach(async (robotId) => {
                await robotRepo.updateDirectly(robotId, { org: resultObject._id });
            });
        }
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
        formObject = this.convertToLowerCase(formObject)
        const existingObject = await this.find({ _id })
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        if (formObject.email) {
            const uniqueObjectResult = await this.isEmailUnique(formObject, existingObject)
            if (!uniqueObjectResult.success) return uniqueObjectResult
        }
        const resultObject = await orgModel.findByIdAndUpdate({ _id }, formObject, { new: true, select: "-password" })
        if (formObject.robots) {
            if (Array.isArray(existingObject.result.robots) && existingObject.result.robots.length !== 0) {
                const existingRobotIds = existingObject.result.robots.map(robot => robot.toString());
                const formRobotIds = formObject.robots;
                const addedRobots = formRobotIds.filter(robotId => !existingRobotIds.includes(robotId));
                const removedRobots = existingRobotIds.filter(robotId => !formRobotIds.includes(robotId));
                if (addedRobots.length > 0) {
                    addedRobots.forEach(async (robotId) => {
                        await robotRepo.update(robotId, { org: resultObject._id });
                    });
                }
                if (removedRobots.length > 0) {
                    removedRobots.forEach(async (robotId) => {
                        await robotRepo.updateDirectly(robotId, { $unset: { org: 1 }, users: [] });
                        existingObject.result.users.forEach(async (userId) => {
                            await userRepo.updateDirectly(userId, { $pull: { robot: robotId } });
                        });
                    });
                }
            } else {
                resultObject.robots.forEach(async (robotId) => {
                    await robotRepo.updateDirectly(robotId, { org: resultObject._id });
                });
            }
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
        const resultObject = await orgModel.findByIdAndUpdate({ _id }, formObject, { new: true, select: "-password" })
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
        const resultObject = await orgModel.updateMany(filterObject, formObject)
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

        const resultObject = await orgModel.findByIdAndUpdate({ _id }, { isActive: false })
        if (!resultObject) return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
        await robotRepo.updateMany({ org: _id }, { $unset: { org: 1 }, users: [] })
        existingObject.result.users.forEach(async (userId) => {
            await userRepo.updateDirectly(userId, { isActive: false });
        });
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

exports.comparePassword = async (emailString, passwordString) => {
    try {
        emailString = emailString.toLowerCase()
        const existingObject = await this.get({ email: emailString }, {})

        if (!existingObject.success) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        const matchingPasswords = await bcrypt.compare(passwordString, existingObject.result.password)
        if (!matchingPasswords) return {
            success: false,
            code: 409,
            error: "Incorrect Password."
        };

        return {
            success: true,
            result: existingObject.result,
            code: 200
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


exports.resetPassword = async (emailString, newPasswordString) => {
    try {
        emailString = emailString.toLowerCase()
        const existingObject = await this.find({ email: emailString })

        if (!existingObject.success) return {
            success: false,
            code: 404,
            error: "No Matching Result Found."
        }

        const hashedPassword = await bcrypt.hash(newPasswordString, saltrounds)
        const resultObject = await orgModel.findOneAndUpdate({ email: emailString }, { password: hashedPassword })

        if (!resultObject) return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened."
        }

        return {
            success: true,
            code: 200,
            result: { message: "Finshed Successfully." }
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
    const duplicateObject = await this.find({ email: formObject.email })

    if (duplicateObject.success) {
        if (duplicateObject.result.email == formObject.email) return {
            success: false,
            code: 409,
            error: "This Email is Already Used."
        }
    }

    return {
        success: true,
        code: 200
    }
}

exports.isEmailUnique = async (formObject, existingObject) => {

    if (formObject.email !== existingObject.result.email) {
        const duplicateObject = await this.find({ email: formObject.email })
        if (duplicateObject.success &&
            duplicateObject.result._id.toString() !== existingObject.result._id.toString()) return {
                success: false,
                code: 409,
                error: "This Email is Already Used."
            }
    }
    return {
        success: true,
        code: 200
    }

}

exports.convertToLowerCase = (formObject) => {
    if (formObject.email) formObject.email = formObject.email.toLowerCase()
    return formObject
}