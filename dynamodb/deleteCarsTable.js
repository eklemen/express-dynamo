var AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
  endpoint: "http://localhost:8000"
});
var dynamodb = new AWS.DynamoDB();
dynamodb.deleteTable({TableName: 'Cars'}, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("table deleted...");
  }
});