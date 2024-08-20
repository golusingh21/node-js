const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const countrySchema = require('./commonSchema');
const authSchema = require('./authSchema')

const typeDefs = mergeTypeDefs([
    countrySchema.typeDefs,
    authSchema.typeDefs
])

const resolvers = mergeResolvers([
    countrySchema.resolvers,
    authSchema.resolvers
])

module.exports = {typeDefs, resolvers}