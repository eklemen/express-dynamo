const express = require('express');
const AWS = require('aws-sdk');
const router = express.Router();
const uuid = require('node-uuid');

AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
const ddb = new AWS.DynamoDB.DocumentClient();


const params = {
  TableName: "Cars",
  ProjectionExpression: "#id, #name, #type, #manufacturer, #fuel_type, #description",
  ExpressionAttributeNames: {
    "#id": "id",
    "#name": "name",
    "#type": "type",
    "#manufacturer": "manufacturer",
    "#fuel_type": "fuel_type",
    "#description": "description"
  }
};

/* GET cars listing. */
router.get('/', function(req, res, next) {
  console.log('scanning cars...');
  // res.send('scanning');
  ddb.scan(params, (err, data) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.send(data);
    }
  });
});

/* GET car by id. */
router.get('/:id', function(req, res, next) {
  console.log('scanning car by ID...');
  console.log('id', req.params.id);
  const params = {
    TableName : "Cars",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "id"
    },
    ExpressionAttributeValues: {
      ":id": req.params.id
    }
  };
  // res.send('scanning');
  ddb.query(params, (err, data) => {
    if (err) {
      console.log(err);
      next(err);
    } else {
      res.send(data);
    }
  });
});

/* GET cars listing. */
router.post('/', function(req, res, next) {
  const {type, name, manufacturer, fuel_type, description} = req.body;
  const params = {
    TableName: "Cars",
    Item: {
      id: uuid.v4(),
      type,
      name,
      manufacturer,
      fuel_type,
      description
    }
  };
  ddb.put(params, (err, data) => {
    if (err) {
      next(err);
    } else {
      console.log("hooray");
      res.send(data);
    }
  });
});

module.exports = router;
