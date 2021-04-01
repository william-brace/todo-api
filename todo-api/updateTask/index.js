"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
AWS.config.update({ region: "us-east-2" });

exports.handler = async (event, context) => {
  let responseBody;
  let statusCode;

  let { id } = event.pathParameters;
  let { title, completed } = JSON.parse(event.body);

  const params = {
    ExpressionAttributeNames: {
      "#T": "title",
      "#C": "completed",
      "#U": "updatedAt",
    },
    ExpressionAttributeValues: {
      ":t": title,
      ":c": completed,
      ":u": new Date().toISOString(),
    },
    Key: {
      id: id,
    },
    ReturnValues: "ALL_NEW",
    TableName: "Tasks",
    UpdateExpression: "SET #T = :t, #C = :c, #U = :u",
  };

  try {
    const data = await documentClient.update(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 200;
  } catch (err) {
    responseBody = `Unable to update task information ${err}`;
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
