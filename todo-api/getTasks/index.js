"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
AWS.config.update({ region: "us-east-2" });

exports.handler = async (event, context) => {
  let responseBody;
  let statusCode;

  let { pageSize, lastItem } = JSON.parse(event.body);

  var params = {
    ExpressionAttributeNames: {
      "#T": "title",
      "#C": "completed",
    },
    ProjectionExpression: "#T, #C",
    TableName: "Tasks",
    Limit: pageSize,
  };

  if (lastItem) {
    lastItem = lastItem.toString();
    params.ExclusiveStartKey = { id: lastItem };
  }

  try {
    const data = await documentClient.scan(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 200;
  } catch (err) {
    responseBody = "Unable to get tasks information";
    statusCode = 500;
  }

  const response = {
    statusCode: statusCode,
    headers: {
      myHeader: "test",
    },
    body: responseBody,
  };

  return response;
};
