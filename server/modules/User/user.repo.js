const bcrypt = require("bcrypt");
const userModel = require("./user.model")
const orgRepo = require("../Org/org.repo");
const robotRepo = require("../Robot/robot.repo");
const { prepareQueryObjects } = require("../../helpers/query.helper")
const saltrounds = 5;

exports.find = async (filterObject) => {
    try {
        const resultObject = await userModel.findOne(filterObject).lean();
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
        const resultObject = await userModel.findOne(filterObject).lean()
            .populate({ path: "permission", select: "name permissions" })
            .populate({ path: "org", select: "name email" })
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
        const resultArray = await userModel.find(filterObject).lean()
            .populate({ path: "permission", select: "name permissions" })
            .populate({ path: "org", select: "name email" })
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
        const count = await userModel.countDocuments(filterObject);
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
        const resultObject = new userModel(formObject);
        await resultObject.save();;
        if (formObject.org) await orgRepo.updateDirectly(resultObject.org, { $addToSet: { users: resultObject._id } })
        if (formObject.robots) {
            resultObject.robots.forEach(async (robotId) => {
                await robotRepo.updateDirectly(robotId, { $addToSet: { users: resultObject._id } });
            });
        }

        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened.",
            };
        await resultObject.populate([
            { path: "permission", select: "name permissions" },
            { path: "org", select: "name" }
        ]);
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
        let robots = formObject.robots ? formObject.robots : []
        if (formObject.org && formObject.org !== (existingObject.result.org).toString()) formObject = { ...formObject, robots: robots }
        const resultObject = await userModel.findByIdAndUpdate({ _id }, formObject, {
            new: true, select: "-password", populate: [
                { path: "permission", select: "name permissions" },
                { path: "org", select: "name" }
            ]
        })
        if (formObject.org && formObject.org !== (existingObject.result.org).toString()) {
            await orgRepo.updateDirectly(existingObject.result.org, { $pull: { users: resultObject._id } })
            await orgRepo.updateDirectly(formObject.org, { $addToSet: { users: resultObject._id } })
            existingObject.result.robots.forEach(async (robot) => {
                await robotRepo.up(robot, { $pull: { users: _id } })
            })
        }
        if (formObject.robots) {
            if (Array.isArray(existingObject.result.robots) && existingObject.result.robots.length !== 0) {
                console.log(existingObject.result.robots);
                const existingRobotIds = existingObject.result.robots.map(robot => robot.toString());
                const formRobotIds = formObject.robots;
                const addedRobots = formRobotIds.filter(robotId => !existingRobotIds.includes(robotId));
                const removedRobots = existingRobotIds.filter(robotId => !formRobotIds.includes(robotId));
                if (addedRobots.length > 0) {
                    addedRobots.forEach(async (robotId) => {
                        await robotRepo.updateDirectly(robotId, { $addToSet: { users: resultObject._id } });
                    });
                }
                if (removedRobots.length > 0) {
                    removedRobots.forEach(async (robotId) => {
                        await robotRepo.updateDirectly(robotId, { $pull: { users: _id } });
                    });
                }
            }
            else {
                resultObject.robots.forEach(async (robotId) => {
                    await robotRepo.updateDirectly(robotId, { $addToSet: { users: resultObject._id } });
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
        const resultObject = await userModel.findByIdAndUpdate({ _id }, formObject, { new: true, select: "-password" })
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
        const resultObject = await userModel.updateMany(filterObject, formObject)
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

exports.deleteMany = async (filterObject) => {
    try {
        const resultObject = await userModel.deleteMany(filterObject);
        if (!resultObject) {
            return {
                success: false,
                code: 404,
                error: "No Matching Results Found."
            };
        }
        return {
            success: true,
            code: 200,
            result: { message: "Deleted Successfully." },
        };
    } catch (err) {
        console.log(err.message);
        return {
            success: false,
            code: 500,
            error: "Unexpected Error Occurred."
        };
    }
};

exports.remove = async (_id) => {
    try {
        const existingObject = await this.find({ _id })
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };

        const resultObject = await userModel.findByIdAndUpdate({ _id }, { isActive: false })
        if (!resultObject) return {
            success: false,
            code: 500,
            error: "Unexpected Error Happened.",
        };
        await orgRepo.updateDirectly(existingObject.result.org, { $pull: { users: _id } })
        existingObject.result.robots.forEach(async (robotId) => {
            await robotRepo.updateDirectly(robotId, { $pull: { users: _id } });
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
        const resultObject = await userModel.findOneAndUpdate({ email: emailString }, { password: hashedPassword })

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