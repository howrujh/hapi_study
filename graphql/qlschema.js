const { gql } = require('apollo-server-hapi');

const typeDefs = gql`

type LoginResponse {
    email: String!
    name: String!
    access_token: String!
}

type Query {
    hello: String!
}

type Mutation {
    create(email: String!, name: String!, pw: String!): LoginResponse
    login(email: String!, pw: String!): LoginResponse
}

`;

module.exports = typeDefs;
