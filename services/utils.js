let db = require('./redis');
let _ = require('underscore');

async function createObject(obj) {
    
    try{


        var key = obj.objectType +'_'+ obj.objectId;

        var sendObj = {};
        for (k in obj) {            
            if(Array.isArray(obj[k])){            
                createArray(key+'_'+k, obj[k]);
                sendObj[k] = '$_'+key+'_'+k;            
            }else if(typeof obj[k] == 'object'){
                sendObj[k] = '$_'+obj[k].objectType +'_'+ obj[k].objectId;
                createObject(obj[k]);            
            }else{
                sendObj[k] = obj[k];
            }
        }
            
        await db.saveHash(key, sendObj);
        return key;
    } catch (e) {
        return e;
    }

}

async function createArray(key, arr) {
    
    let promises = arr.map(async(k)=> {            
        if(typeof k == 'object'){            
            await createObject(k);
            return '$_'+k.objectType +'_'+ k.objectId;            
        }else{
            return k;
        }
    });

    var newArr = await Promise.all(promises);
    await db.saveSetValue(key, newArr);
    
}

module.exports = {
    createObject,
    createArray
}