let schema = {};
schema.linkedService = {
  "id": "/LinkedService",
  "type": "object",
  "properties": {
    "_org":{
      "type": "string"
    },
    "objectId": {
      "type": "string"
    },
    "objectType": {
      "type": "string"
    },
    "name": {
      "type": "string"
    }
  },
  "required": ["_org"]
};

schema.planCostShares = {
  "id": "/PlanCostShares",
  "type": "object",
  "properties": {
    "_org":{
      "type": "string"
    },
    "objectId": {
      "type": "string"
    },
    "objectType": {
      "type": "string"
    },
    "deductible": {
      "type": "number"
    },
    "copay": {
      "type": "number"
    }
  },
  "required": ["_org"]
};

schema.linkedPlanServicesItem = {
  "id":"/LinkedPlanServicesItem",
  "type":"object",
  "properties": {
    "linkedService": {
      "$ref": "/LinkedService"
    },
    "planserviceCostShares": {
      "$ref": "/PlanCostShares"
    },
    "_org":{
      "type": "string"
    },
    "objectId": {
      "type": "string"
    },
    "objectType": {
      "type": "string"
    }
  },
  "required": ["_org"]
}

schema.plan = {
  "id": "/plan",
  "type": "object",
  "properties": {
    "planCostShares": {
      "$ref": "/PlanCostShares"
    },
    "linkedPlanServices": {
      "type": "array",
      "items": {
        "$ref": "/LinkedPlanServicesItem"
      }
    },
    "_org":{
      "type": "string"
    },
    "objectId": {
      "type": "string"
    },
    "objectType": {
      "type": "string"
    },
    "planType": {
      "type": "string"
    },
    "creationDate": {
      "type": "string"
    }
  },
  "required": ["_org", "objectId"]
}


module.exports = schema;