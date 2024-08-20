const {gql} = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const userModel = require('../model/usreModel')

const typeDefs = gql`
    type Auth{
        id: ID!
        name: String
        email: String
    }

    type Register{
        name: String!
        email: String!
        password: String!
    }

    type AuthPayload{
        token: String!
        user: Auth!
    }

    type Mutation{
        login(email: String!, password: String!): AuthPayload!
    }

    type Mutation{
        register(name: String!, email: String!, password: String!): Register!
    }
`

const resolvers = {
    Mutation: {
        login: async(_, {email, password}) => {
            const user = await userModel.findOne({email});
            if(!user){
                throw new Error('Invalid credentials');
            }
            const isMatch = await bcrypt.compare(password, user.password);
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
        },
        register: async(_, {name, email, password}) => {
            const user = await userModel.findOne({email});
            if(!user){
                throw new Error('User already exist with this email');
            };
            const encryptPassword = await bcrypt.hash(password, 10);
            const data = await userModel.create({
                name,
                email,
                password: encryptPassword
            })
            if(data){
                return 'User created successfully'
            }
        }
    }
}

module.exports = {typeDefs, resolvers}