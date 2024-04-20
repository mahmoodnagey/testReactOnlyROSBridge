const operationModel = require("./operation.model");
const { prepareQueryObjects } = require("../../helpers/query.helper")
const userRepo = require('../User/user.repo');

exports.find = async (filterObject) => {
    try {
        const resultObject = await operationModel.findOne(filterObject).lean();
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
        const resultObject = await operationModel
            .findOne(filterObject)
            .lean()
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
        let totalField = filterObject.totalField;
        delete filterObject["totalField"];
        let normalizedQueryObjects = await prepareQueryObjects(filterObject, sortObject);
        filterObject = normalizedQueryObjects.filterObject;
        sortObject = normalizedQueryObjects.sortObject;
        let resultArray = await operationModel.find(filterObject).lean()
            .sort(sortObject)
            .select(selectionObject)
        const count = await operationModel.countDocuments(filterObject);
        const totals = await calculateTotal(resultArray, totalField);
        resultArray = resultArray.slice((pageNumber - 1) * limitNumber, (pageNumber - 1) * limitNumber + limitNumber);
        return {
            success: true,
            code: 200,
            result: resultArray,
            totals,
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

exports.listAreas = async (filterObject, pageNumber, limitNumber) => {
    try {
        delete filterObject["page"], delete filterObject["limit"]
        const resultArray = await operationModel.find(filterObject).lean()
            .limit(limitNumber)
            .skip((pageNumber - 1) * limitNumber);

        const areaSet = new Set();
        resultArray.forEach(item => {
            areaSet.add(item.area);
        });
        const uniqueAreas = Array.from(areaSet);
        const count = uniqueAreas.length;
        return {
            success: true,
            code: 200,
            result: uniqueAreas,
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
        if (formObject.pointsLocation && formObject.pointsLocation.length < 2) {
            return {
                success: false,
                code: 400,
                error: "Points Location must contain at least 2 points.",
            };
        }
        let userObject = await userRepo.find({ _id: formObject.user })
        if (!userObject.success)
            return {
                success: false,
                code: 400,
                error: "Invalid user.",
            };
        if ((userObject.result.org).toString() !== (formObject.org).toString())
            return {
                success: false,
                code: 400,
                error: "Invalid organization.",
            };
        let isValidRobot = userObject.result.robots.some(robotId => robotId.toString() === formObject.robot.toString())
        if (!isValidRobot)
            return {
                success: false,
                code: 400,
                error: "Invalid robot.",
            };
        const resultObject = new operationModel(formObject);
        await resultObject.save();
        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened.",
            };
        // const startDate = new Date(resultObject.startDate)
        // const month = startDate.toLocaleString('en-US', { month: 'short' });
        // const batteryHours = resultObject.battery
        // const areaDistance = resultObject.distance
        // const accuracyPercentage = resultObject.accuracy
        // const record = {
        //     month: month,
        //     batteryHours:,
        //     areaDistance:,
        //     accuracyPercentage:
        // }
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
        delete formObject["org"];
        delete formObject["robot"];
        delete formObject["user"];
        const existingObject = await this.find({ _id });
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };
        if (formObject.pointsLocation && formObject.pointsLocation.length < 2) {
            return {
                success: false,
                code: 400,
                error: "Points Location must contain at least 2 points.",
            };
        }
        const resultObject = await operationModel.findByIdAndUpdate({ _id }, formObject, { new: true });

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

exports.remove = async (_id) => {
    try {
        const resultObject = await operationModel.findByIdAndDelete({ _id })

        if (!resultObject) return {
            success: false,
            code: 404,
            error: "No Matching Result Found.",
        };

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

exports.updateStatus = async (_id) => {
    try {

        const existingObject = await this.find({ _id });
        if (!existingObject.success)
            return {
                success: false,
                code: 404,
                error: "No Matching Result Found.",
            };

        const resultObject = await operationModel.findByIdAndUpdate({ _id }, { isActive: false });

        if (!resultObject)
            return {
                success: false,
                code: 500,
                error: "Unexpected Error Happened."
            };

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

function calculateTotal(array, totalField) {
    let totals
    if (!totalField) {
        totals = array.reduce((accumulator, operation) => {
            accumulator.distanceTotal += operation.distance;
            accumulator.runningHoursTotal += operation.runningHours;
            accumulator.sealantVolumeTotal += operation.sealantVolume;
            accumulator.cracksNumberTotal += operation.cracksNumber;
            accumulator.cracksVolumeTotal += operation.cracksVolume;
            accumulator.accuracyTotal += operation.accuracy;
            return accumulator;
        }, {
            distanceTotal: 0,
            runningHoursTotal: 0,
            sealantVolumeTotal: 0,
            cracksNumberTotal: 0,
            cracksVolumeTotal: 0,
            accuracyTotal: 0
        });
        return totals;
    } else {
        totals = array.reduce((accumulator, operation) => {
            accumulator[totalField + 'Total'] += operation[totalField];
            return accumulator;
        }, {
            [totalField + 'Total']: 0
        });
    }
    return totals;
};

