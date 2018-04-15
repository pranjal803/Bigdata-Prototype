var redis = require('redis');
var _ = require('underscore');
var port = process.env.REDIS_PORT || 6379;
var host = process.env.REDIS_HOST || '127.0.0.1';

var options = {
    port: port,
    host: host,
    retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
};

var client = redis.createClient(options);

client.on("error", function(err) {
    console.log("Error " + err);
});

async function saveKey(key, value) {
    var newValue = value;
    if (typeof newValue == 'object') {
        newValue = JSON.stringify(newValue);
    }

    return new Promise((resolve, reject) => {
        client.set(key, newValue, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getKeyValue(key) {

    return new Promise((resolve, reject) => {
        client.get(key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function saveHashKey(hname, key, value) {
    var newValue = value;
    if (typeof newValue == 'object') {
        newValue = JSON.stringify(newValue);
    }

    return new Promise((resolve, reject) => {
        client.hset(hname, key, newValue, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getHashKeyObject(hname, key) {

    return new Promise((resolve, reject) => {
        client.hget(hname, key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getHash(hname) {

    return new Promise((resolve, reject) => {
        client.hgetall(hname, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function saveHash(hname, obj) {

    return new Promise((resolve, reject) => {
        client.hmset(hname, obj, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}
async function deleteHashkey(hname, key) {

    return new Promise((resolve, reject) => {
        client.hdel(hname, key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function deleteKey(key) {

    return new Promise((resolve, reject) => {
        client.del(key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getKeyNames(pattern) {

    return new Promise((resolve, reject) => {
        client.keys(pattern, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function addSetValue(setName, value) {

    return new Promise((resolve, reject) => {
        client.sadd(setName, value, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getSetValue(setName) {

    return new Promise((resolve, reject) => {
        client.smembers(setName, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function saveSetValue(setName, value) {

    return new Promise((resolve, reject) => {
        client.sadd(setName, value, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function getKeyType(keyName) {

    return new Promise((resolve, reject) => {
        client.type(keyName, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        })
    })
}

async function getKeyNames(pattern) {

    return new Promise((resolve, reject) => {
        client.keys(pattern, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

async function checkExists(key) {

    return new Promise((resolve, reject) => {
        client.exists(key, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })   
}

async function lpush(list, value) {

    return new Promise((resolve, reject) => {
        client.lpush(list, value, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })   
}

async function rpop(list) {

    return new Promise((resolve, reject) => {
        client.rpop(list, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })   
}

async function rpoplpush(list1, list2) {
    return new Promise((resolve, reject) => {
        client.rpoplpush(list1, list2, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })   
}

async function listLength(list) {

    return new Promise((resolve, reject) => {
        client.llen(list, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })   
}



module.exports = {
    getKeyNames,
    getKeyType,
    saveSetValue,
    getSetValue,
    addSetValue,
    getKeyNames,
    deleteKey,
    deleteHashkey,
    getHashKeyObject,
    getHash,
    saveHash,
    saveHashKey,
    getKeyValue,
    saveKey,
    checkExists,
    lpush,
    rpop,
    rpoplpush,
    listLength
}