"use strict";

const dynamodb = require("./dynamodb");
const tableName = process.env.DYNAMODB_RACES_TABLE;

module.exports.list = (event, context, callback) => {
  const userId = event.queryStringParameters.userId;

  const params = {
    TableName: tableName,
    FilterExpression: "userId = :val",
    ExpressionAttributeValues: { ":val": userId },
    ReturnConsumedCapacity: "TOTAL"
  };

  // fetch all races from the database by userId
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the race by user id."
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://kings-court.kellycrowther.io",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result.Items)
    };
    callback(null, response);
  });
};

module.exports.listAll = (event, context, callback) => {
  const params = {
    TableName: tableName
  };

  // fetch all races from the database by userId
  dynamodb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the all races."
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://kings-court.kellycrowther.io",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(result.Items)
    };
    callback(null, response);
  });
};
