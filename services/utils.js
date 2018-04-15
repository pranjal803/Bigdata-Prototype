let db = require('./redis');
let _ = require('underscore');

async function createObject(obj) {

    try {
        var key = obj.objectType + '_' + obj.objectId;
        var sendObj = {};
        for (k in obj) {
            if (Array.isArray(obj[k])) {
                sendObj[k] = await createArray(key + '_' + k, obj[k]);
            } else if (typeof obj[k] == 'object') {
                sendObj[k] = await createObject(obj[k]);
            } else {
                sendObj[k] = obj[k];
            }
        }

        await db.saveHash(key, sendObj);
        return '$_' + key;
    } catch (e) {
        return e;
    }
}

async function createArray(key, arr) {

    let promises = arr.map(async(k) => {
        if (typeof k == 'object') {
            return await createObject(k);
            //return k.objectType + '_' + k.objectId;
        } else {
            return k;
        }
    });

    var newArr = await Promise.all(promises);
    await db.saveSetValue(key, newArr);
    return '!_' +key;
}

async function createPlan(planUUID, plan) {
    try {
        let objectName = await createObject(plan);
        await db.saveKey(planUUID, objectName);
        return true;
    } catch (e) {
        throw e;
    }
}


async function getObject(readKey) {

    try {
        let myObject = await db.getHash(readKey);

        for (key in myObject) {
            if (myObject[key].substring(0, 2) == '$_') {

                myObject[key] = await getObject(myObject[key].substring(2));

            } else if (myObject[key].substring(0, 2) == '!_') {
                myObject[key] = await getArray(myObject[key].substring(2));

            }
        }

        return myObject;
    } catch (e) {

        throw e;
    }
}

async function getArray(readKey) {

    try {
        let myArray = await db.getSetValue(readKey);
        let promises = myArray.map(async(value) => {

            if (value.substring(0, 2) == '$_') {

                return await getObject(value.substring(2));

            } else if (value.substring(0, 2) == '!_') {

                return await getArray(value.substring(2));
            }

            return value;
        })

        return await Promise.all(promises);

    } catch (e) {
        throw e;
    }
}

async function getPlan(planUUID) {
    try {
        var plan = await db.getKeyValue(planUUID);

        if (!plan) {
            return false;
        }

        return await getObject(plan.substring(2));

    } catch (e) {
        throw e;
    }
}


async function deleteObject(deleteKey) {

    try {
        let myObject = await db.getHash(deleteKey);

        for (key in myObject) {
            if (myObject[key].substring(0, 2) == '$_') {

                await deleteObject(myObject[key].substring(2));

            } else if (myObject[key].substring(0, 2) == '!_') {

                await deleteArray(myObject[key].substring(2));

            }
        }

        await db.deleteKey(deleteKey);
        return true;
    } catch (e) {

        throw e;
    }
}

async function deleteArray(deleteKey) {

    try {
        let myArray = await db.getSetValue(deleteKey);
        myArray.forEach(async(value) => {
            if (value.substring(0, 2) == '$_') {
                await deleteObject(value.substring(2));
            } else if (value.substring(0, 2) == '!_') {
                await deleteArray(value.substring(2));
            }
        })

        await db.deleteKey(deleteKey);

    } catch (e) {
        throw e;
    }
}

async function deletePlan(planUUID) {
    try {
        var plan = await db.getKeyValue(planUUID);

        if (!plan) {
            return false;
        }

        await deleteObject(plan.substring(2));
        await db.deleteKey(planUUID);

        return true;
    } catch (e) {
        throw e;
    }
}


async function postSchema(schema) {
    try {
        return await db.saveKey('schema', JSON.stringify(schema));
    } catch (e) {
        throw e;
    }
}

async function checkKey(key) {
    try {
        return await db.checkExists(key);
    } catch (e) {
        throw e;
    }
}

async function getSchema() {
    try {
        let schema = await db.getKeyValue('schema');
        return JSON.parse(schema);
    } catch (e) {
        throw e;
    }
}

async function queuePlan(method, plan) {
    try {
        
        let sendObj = {
            method: method,
            plan: plan
        }

        await db.lpush('searchQueue', JSON.stringify(sendObj));

        return true;        
    } catch (e) {
        throw e;
    }
}

module.exports = {
    createPlan,
    getPlan,
    postSchema,
    checkKey,
    getSchema,
    deletePlan,
    queuePlan
}