"use strict";

const dynamodb = require("./dynamodb");

module.exports.delete = (event, context, callback) => {
  const id = event.pathParameters.id;
  const params = {
    TableName: process.env.DYNAMODB_RACES_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  // delete the race from the database
  dynamodb.delete(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't remove the race."
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ id: id })
    };
    callback(null, response);
  });
};
