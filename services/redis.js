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

exports.saveKey =  function(key, value, done){
  var newValue = value;
  if(typeof newValue == 'object'){
    newValue = JSON.stringify(newValue);
  }
  client.set(key, newValue, function(err, result){
      done(err, result);    
  });
}

exports.getKeyValue =  function(key, done){ 
  
  client.get(key, function(err, value) {
      done(err, value);          
  });
}

exports.getKeyObject =  function(key, done){ 
  
  client.get(key, function(err, value) {
    done(err, JSON.parse(value));          
  });
}

exports.saveHashKey =  function(hname,key, value, done){
  var newValue = value;
  if(typeof newValue == 'object'){
    newValue = JSON.stringify(newValue);
  }
  client.hset(hname,key, newValue, function(err, result){
      done(err, result);    
  });
}

exports.getHashKeyValue =  function(hname, key, done){ 
  client.hget(hname, key, function(err, value) {
      done(err, value);          
  });
}

exports.getHashKeyObject =  function(hname, key, done){ 
  client.hget(hname, key, function(err, value) {
      done(err, JSON.parse(value));          
  });
}

exports.getHashFullObject =  function(hname, done){ 
  client.hgetall(hname, function(err, value) {    
      done(err, value);    
  });
}

exports.deleteHashkey =  function(hname, key, done){ 
  client.hdel(hname, key, function(err, value) {    
      done(err, value);    
  });
}

exports.deleteKey =  function(key, done){ 
  client.del(key, function(err, value) {  
    done(err, value);          
  });
}

exports.getKeyNames = function(pattern, done){
  client.keys(pattern, function(err, replies){
      done(err, replies);          
  })
}

exports.addSetValue = function(setName, value, done){
  client.sadd(setName, value, function(err, value){
    done(err, value);
  })
}

exports.getSetValue = function(setName, done){
  client.smembers(setName, function(err, value){
    done(err, value);
  });
}

exports.getKeyType = function(keyName, done){
  client.type(keyName, function(err, value){
    done(err, value);
  })
}

exports.getKeyNames = function(pattern, done){
  client.keys(pattern, function(err, replies){
      done(err, replies);          
  })
}