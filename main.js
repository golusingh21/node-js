const connectDb = require('./config/connection')
const dotenv = require('dotenv');
const {ApolloServer} = require('apollo-server')
const {typeDefs, resolvers} = require('./graphqlSchema/schema')

const port = 8000;
dotenv.config()
connectDb()

const app = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/graphql'
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});