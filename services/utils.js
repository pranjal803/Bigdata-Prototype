let _ = require('underscore');
let db = require('./redis');
let async = require('async');
exports.insertObject = insertObject = function(parent, myObject, baseKey){
  _.each(myObject, (value, key) => {

    var insertValue = value;
    if(_.isArray(value)){
      insertValue = parent+'/'+key;
      insertArray(insertValue, value, baseKey);
      insertIntoBaseKeySet(insertValue, baseKey);
      insertIntoBaseKeySet(insertValue, parent);
      insertValue = '~'+insertValue;
    }else if(_.isObject(value)){
      insertValue = parent+'/'+key;
      insertObject(insertValue, value, baseKey);
      insertIntoBaseKeyMap(insertValue, baseKey);
      insertIntoBaseKeyMap(insertValue, parent);
      insertValue = '~'+insertValue;
    }

    db.saveHashKey(parent, key, insertValue, function(e, done){

    });

          
  });
}

exports.insertArray = insertArray = function(parent, myArray, baseKey){

  _.each(myArray, (value, key)=> {

    var insertValue = value;
    if(_.isArray(value)){
      insertValue = parent+'/'+key;
      insertArray(insertValue, value, baseKey);
      insertIntoBaseKeySet(insertValue, baseKey);
      insertIntoBaseKeySet(insertValue, parent);
      insertValue = '~'+insertValue;
    }else if(_.isObject(value)){
      insertValue = parent+'/'+key;
      insertObject(insertValue, value, baseKey);
      insertIntoBaseKeyMap(insertValue, baseKey);
      insertIntoBaseKeyMap(insertValue, parent);
      insertValue = '~'+insertValue;
    }

    db.addSetValue(parent, insertValue, (e, done)=>{});

  });
}

exports.insertIntoBaseKeySet = insertIntoBaseKeySet = function(key, baseKey){
  db.addSetValue(baseKey+"-set", key, (e, done)=>{});
}

exports.insertIntoBaseKeyMap = insertIntoBaseKeyMap = function(key, baseKey){
  db.addSetValue(baseKey+"-map", key, (e, done)=>{});
}

exports.getKey = function(key, done){
  console.log(key);
  db.getKeyObject(key, (err, value)=>{
    console.log(value);
    done(err, value);
  });
  
}

exports.deleteKey = function(key, done){
  // db.getKeyNames(key+"*", (err, values)=>{
  //   _.each(values, (value)=>{
  //     db.deleteKey(value, (err, num)=>{});
  //   });
  //   done(err, true);
  // });
  db.deleteKey(key, (err, val)=>{
    done(null, true);
  });
}

exports.insertKey = function(key, value, done){
  db.saveKey(key, value, (err, ret)=>{
    done(err, ret);
  });
}