const {gql} = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userModel = require('../model/usreModel')

const typeDefs = gql`
    type User{
        id: ID!
        name: String
        email: String
    }

    type AuthPayload{
        token: String
    }

    type Mutation{
        login(email: String!, password: String!): AuthPayload
    }
`

const resolvers = {
    Mutation: {
        login: async(_, {email, password}) => {
            const user = await userModel.findOne({email});
            if(!user){
                throw new Error('Invalid credentials');
            }
            const isMatch = await bcrypt.compare('123456', "U2FsdGVkX18UmGH3gKX433qfNxQCUVnvhhD3ziDwHFs=");
            console.log(33, isMatch)
            if(isMatch){
                const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'});
                return{
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                }
            }
            throw new Error('Invalid credentials');
        }
    }
}

module.exports = {typeDefs, resolvers}