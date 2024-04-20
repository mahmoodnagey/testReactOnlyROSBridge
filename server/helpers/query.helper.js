exports.prepareQueryObjects = async (filterObject, sortObject) => {
    try {
        delete filterObject["page"], delete filterObject["limit"]
        let finalFilterObject = handleSearchParams(filterObject);
        let finalSortObject = handleSortParams(filterObject);

        finalFilterObject = { ...filterObject, ...finalFilterObject };
        finalSortObject = { ...sortObject, ...finalSortObject };
        return {
            filterObject: finalFilterObject,
            sortObject: finalSortObject,
        };

    } catch (err) {
        console.log(`err.message`, err.message);
        return {};
    }
};
function calculateTotal(array, totalField) {
    try {
        let totals
        console.log(totalField);
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
        }
        
    } catch (err) {
        console.log(`err.message`, err.message);
        return {};
    }
};

function handleSearchParams(filterObject) {
    let finalFilterObject = {};

    finalFilterObject = handleDateParams(filterObject, finalFilterObject)
    finalFilterObject = handleSearchProperty('area', filterObject, finalFilterObject);


    return finalFilterObject;
}
function handleDateParams(filterObject, finalFilterObject) {
    if (filterObject?.dateFrom || filterObject?.dateTo) {
        let dateField = filterObject?.dateField;
        finalFilterObject[`${dateField}`] = {};

        if (filterObject.dateFrom) {
            finalFilterObject[`${dateField}`].$gte = new Date(filterObject.dateFrom);
            delete filterObject["dateFrom"];
        }
        if (filterObject.dateTo) {
            finalFilterObject[`${dateField}`].$lte = new Date(filterObject.dateTo);
            delete filterObject["dateTo"];
        }
        delete filterObject["dateField"];
    }
    return finalFilterObject
}

function handleSearchProperty(property, filterObject, finalFilterObject) {
    if (filterObject?.[property]) {
        if (!finalFilterObject.$or) {
            finalFilterObject.$or = [];
        }
        finalFilterObject.$or.push({ [property]: { $regex: filterObject[property], $options: 'i' } });
        delete filterObject[property];
    }

    return finalFilterObject;
}


function handleSortParams(filterObject) {
    let finalSortObject = {};
    finalSortObject = handleSortProperty('sortByAlpha', filterObject, finalSortObject, 1);

    finalSortObject = handleSortProperty('sortByDate', filterObject, finalSortObject, filterObject?.sort || 1);

    return finalSortObject;
}


function handleSortProperty(property, filterObject, finalSortObject, sort) {
    if (filterObject?.[property]) {
        finalSortObject[`${filterObject[property]}`] = parseInt(sort);
        if (property == "sortByDate") delete filterObject["sort"];
        if (property == "sortByAlpha") {

            finalSortObject[`${filterObject[property]}`] = 1;
            delete finalSortObject["sortByAlpha"];

        }
        delete filterObject[property];
    }

    return finalSortObject;
}