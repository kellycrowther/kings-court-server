"use strict";

const uuid = require("uuid");
const dynamodb = require("./dynamodb");

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  /* 
    Add Data Validation Here
  if (typeof data.text !== "string") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create the todo item."
    });
    return;
  }
  */

  const params = {
    TableName: process.env.DYNAMODB_RACES_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.name,
      userId: data.userId,
      wsName: data.wsName,
      createdAt: timestamp,
      updatedAt: timestamp,
      results: data.results
    }
  };

  // write the race to the database
  dynamodb.put(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the race."
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify(params.Item)
    };
    callback(null, response);
  });
};
