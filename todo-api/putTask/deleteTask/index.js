"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
AWS.config.update({ region: "us-east-2" });

exports.handler = async (event, context) => {
  let responseBody;
  let statusCode;

  let { id } = event.pathParameters;

  const params = {
    TableName: "Tasks",
    Key: {
      id: id,
    },
  };

  try {
    const data = await documentClient.delete(params).promise();
    responseBody = JSON.stringify(data.Item);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to delete task information ${err}`;
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
