const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const countrySchema = require('./commonSchema');
const authSchema = require('./authSchema')
const userSchema = require('./userSchema')

const typeDefs = mergeTypeDefs([
    countrySchema.typeDefs,
    authSchema.typeDefs,
    userSchema.typeDefs
])

const resolvers = mergeResolvers([
    countrySchema.resolvers,
    authSchema.resolvers,
    userSchema.resolvers
])

module.exports = {typeDefs, resolvers}