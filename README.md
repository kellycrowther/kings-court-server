# Getting Started

`npm run start` will start a local development environment
This can be used to test both graphql and regular lambda endpoints

# Local Development with AppSync

- run `npm install`
- If you get this error: `Schema must be an instance of GraphQLSchema. Also ensure that there are not multiple versions of GraphQL installed in your node_modules directory.`
  - run `npm dedupe`

# To Do

- refactor schema.graphql to separate out mutations, queries, and subscriptions in to separate files
- refactor mapping templates inside serverless yml to their own yml file
- refactor functions inside serverless yml to their own yml file
- consider making single error handler response.vtl or test using the update_race response
