const express = require('express');
const router = express.Router();
const schema = require('../services/schema');
const Validator = require('jsonschema').Validator;
let _ = require('underscore');
const utils = require('../services/utils');
const v = new Validator();
const uuid = require('uuid/v4');

v.addSchema(schema.linkedService, '/LinkedService');
v.addSchema(schema.planCostShares, '/PlanCostShares');
v.addSchema(schema.linkedPlanServicesItem, '/LinkedPlanServicesItem');


router.post('/',async function(req, res, next) {

    if (v.validate(req.body, schema.plan).valid) {
        //utils.insertObject(req.params.planName, req.body, req.params.planName);
        let newUUID = uuid();
        // utils.insertKey(newUUID, req.body, (er, status)=>{
        //   console.log(er);
        //   res.send(newUUID);
        // })
                
        utils.createObject(req.body).then((ret) => {            
            console.log(ret);
            res.send(newUUID);
        }).catch((e) => {
            console.log(e);
            res.status(500).send('Internal Server Error');
        })


    } else {
        res.status(404).send('Invalid Schema');
    }
});

router.delete('/:planName', function(req, res, next) {
    utils.deleteKey(req.params.planName, (err, response) => {
        res.send("DELETED");
    });
});

router.patch('/*', function(req, res, next) {
    res.json({
        success: "patch"
    });
});

router.get('/:planName', function(req, res) {
    utils.getKey(req.params.planName, (err, value) => {
        if (_.isNull(value)) {
            res.status(404).send('Not found');
        } else {
            res.send(value);
        }
    });
});

router.get('*', function(req, res) {
    res.json({
        success: false
    });
});

router.post('*', function(req, res) {
    res.json({
        success: false
    });
});

router.delete('*', function(req, res) {
    res.json({
        success: false
    });
});


module.exports = router;