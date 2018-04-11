var redis = require('redis');
var _ = require('underscore');
var port = process.env.REDIS_PORT || 6379;  
var host = process.env.REDIS_HOST || '127.0.0.1';

var options= {
    port: port,
    host: host,
    retry_strategy: function (options) {
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

client.on("error", function (err) {
    console.log("Error " + err);
});

async function saveKey(key, value){
  var newValue = value;
  if(typeof newValue == 'object'){
    newValue = JSON.stringify(newValue);
  }
  return client.set(key, newValue);
}

async function getKeyValue(key){   
  return client.get(key);
}

async function saveHashKey(hname,key, value){
  var newValue = value;
  if(typeof newValue == 'object'){
    newValue = JSON.stringify(newValue);
  }
  return client.hset(hname,key, newValue);
}

async function getHashKeyObject(hname, key){ 
  return client.hget(hname, key);
}

async function getHash(hname){ 
  return client.hgetall(hname);
}

async function saveHash(hname, obj){
  return client.hmset(hname, obj);
}
async function deleteHashkey(hname, key){ 
  return client.hdel(hname, key);
}

async function deleteKey(key){ 
  return client.del(key);
}

async function getKeyNames(pattern){
  return client.keys(pattern);
}

async function addSetValue(setName, value){
  return client.sadd(setName, value);
}

async function getSetValue(setName){
  return client.smembers(setName);
}

async function saveSetValue(setName, value){
  return client.sadd(setName, value);
}

async function getKeyType(keyName){
  return client.type(keyName);
}

async function getKeyNames(pattern){
  return client.keys(pattern);
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
  saveKey
}