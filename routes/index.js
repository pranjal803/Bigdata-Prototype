const express = require('express');
const router = express.Router();
const schema = require('../services/schema');
const Validator = require('jsonschema').Validator;
let _ = require('underscore');
const utils = require('../services/utils');
const v = new Validator();
const uuid = require('uuid/v4');

//v.addSchema(schema.linkedService, '/LinkedService');
//v.addSchema(schema.planCostShares, '/PlanCostShares');
//v.addSchema(schema.linkedPlanServicesItem, '/LinkedPlanServicesItem');

router.post('/schema', function(req, res, next) {

    utils.postSchema(req.body)
        .then((resp) => {
            res.send("Schema Added");
        })
        .catch((e) => {
            res.status(500).send('Internal Server Error');
        })

});

router.put('/schema', function(req, res, next) {

    utils.checkKey('schema')
        .then((keyExists) => {
            if (keyExists) {
                return utils.postSchema(req.body);
            }
            res.status(404).send('Schema Not Found');
        })
        .then((resp) => {
            res.send("Schema Updated");
        })
        .catch((e) => {
            res.status(500).send('Internal Server Error');
        })

});

router.post('/', async function(req, res, next) {

    try{        
        var myschema = await utils.getSchema();

        if (v.validate(req.body, myschema).valid) {

            let newUUID = uuid();
            let createdPlan = await utils.createPlan(newUUID, req.body);
            
            res.send(newUUID);

        } else {
            res.status(404).send('Invalid Schema');
        }

    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/:planId', function(req, res, next) {
    
    utils.deletePlan(req.params.planId)
        .then((response) => {
            if(!response){
                res.status(404).send('Plan Not Found');
            }else{
                res.send("Plan Deleted");
            }
        })
        .catch((e) => {
            res.status(500).send('Internal Server Error');       
        })
});

router.put('/:planId', async function(req, res, next) {
    try{        
        var myschema = await utils.getSchema();

        if (v.validate(req.body, myschema).valid) {
            
            let createdPlan = await utils.createPlan(req.params.planId, req.body);
            
            res.send('Plan Updated');

        } else {
            res.status(404).send('Invalid Schema');
        }

    } catch (e) {
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:planId', async function(req, res, next) {
    try{
        let myPlan = await utils.getPlan(req.params.planId);
        
        if (!myPlan) {
            res.status(404).send('Not found');
            return;
        }

        res.send(myPlan);
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }        
});

router.get('*', function(req, res) {
    res.status(404).send('NOT FOUND');
});

router.post('*', function(req, res) {
    res.status(404).send('NOT FOUND');
});

router.delete('*', function(req, res) {
    res.status(404).send('NOT FOUND');
});


module.exports = router;