"use strict";

const dynamodb = require("./dynamodb");
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");

const promisify = foo =>
  new Promise((resolve, reject) => {
    foo((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

const getGreeting = firstName =>
  promisify(callback =>
    dynamoDb.get(
      {
        TableName: process.env.DYNAMODB_RACES_TABLE,
        Key: { id: "3c470110-237a-11ea-9296-7d3c8b0ef06e" }
      },
      callback
    )
  )
    .then(result => {
      if (!result.Item) {
        return firstName;
      }
      return result.Item;
    })
    .then(data => {
      console.info("data: ", data);
      return data;
    });

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQueryType", // an arbitrary name
    fields: {
      // the query has a field called 'greeting'
      greeting: {
        // we need to know the user's name to greet them
        args: {
          firstName: {
            name: "firstName",
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        // the greeting message is a string
        type: GraphQLString,
        // resolve to a greeting message
        resolve: (parent, args) => getGreeting(args)
      }
    }
  })
});

module.exports.query = (event, context, callback) => {
  console.info("EVENT: ", event);
  return graphql(schema, event).then(
    result => callback(null, { statusCode: 200, body: JSON.stringify(result) }),
    err => callback(err)
  );
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_RACES_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  // fetch race from the database
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the race."
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
      body: JSON.stringify(result.Item)
    };
    callback(null, response);
  });
};
