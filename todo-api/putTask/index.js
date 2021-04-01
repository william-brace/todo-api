"use strict";
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB({ apiVersion: "2012-10-08" });
const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-2" });
AWS.config.update({ region: "us-east-2" });

exports.handler = async (event, context) => {
  let responseBody;
  let statusCode;

  let { id, title } = JSON.parse(event.body);

  const params = {
    TableName: "Tasks",
    Item: {
      id: id,
      title: title,
      completed: false,
      creationDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    const data = await documentClient.put(params).promise();
    responseBody = JSON.stringify(data);
    statusCode = 201;
  } catch (err) {
    responseBody = `Unable to put task information ${err}`;
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
