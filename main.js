const connectDb = require('./config/connection')
const dotenv = require('dotenv');
const {ApolloServer} = require('apollo-server')
const {typeDefs, resolvers} = require('./graphqlSchema/schema');
const { getUserFromToken } = require('./middleware/authMiddleware');

const port = 8000;
dotenv.config()
connectDb()

const app = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => {
    const token = req.headers.authorization || null;
    const user = getUserFromToken(token);
    return {user}
  },
  introspection: true,
  playground: true,
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});