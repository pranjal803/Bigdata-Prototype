let express = require('express');
let router = express.Router();
let schema = require('../services/schema');
let Validator = require('jsonschema').Validator;
let _ = require('underscore');
let utils = require('../services/utils');
var v = new Validator();

v.addSchema(schema.linkedService, '/LinkedService');
v.addSchema(schema.planCostShares, '/PlanCostShares');
v.addSchema(schema.linkedPlanServicesItem, '/LinkedPlanServicesItem');


router.post('/:planName', function(req, res, next) {
  if(v.validate(req.body, schema.plan).valid){  
    //utils.insertObject(req.params.planName, req.body, req.params.planName);
    utils.insertKey(req.params.planName, req.body, (er, status)=>{
      res.json({ success: true });
    })
  }else{
    res.status(404).send('Invalid Schema'); 
    //res.json({ success: false, error: "Invalid Schema" });
  }
});

router.delete('/:planName', function(req, res, next) {
  utils.deleteKey(req.params.planName, (err, response) => {
    res.json({
      success: "true"
    });
  });
});

router.patch('/*', function(req, res, next) {
  res.json({
    success: "patch"
  });
});

router.get('/:planName', function(req, res) {  
  utils.getKey(req.params.planName, (err, value)=>{
    if(_.isNull(value)){
      res.status(404).send('Not found'); 
    }else{
      res.json(value);
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
