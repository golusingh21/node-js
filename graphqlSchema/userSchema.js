const {gql} = require('apollo-server');
const userModel = require('../model/usreModel')

// Define the GraphQL schema
const typeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String
    }

    type Users{
        totalRecords: String
        data: [User]
    }

    type Query{
        users(page: String!, size: String!): Users
        user(id: String!): User
        me: User
    }
`

// Define the resolvers
const resolvers = {
    Query: {
        users: async (_, {page, size}) => {
            const _page = Number(page) || 1;
            const _size = Number(size) || 5;
            let list = []
            const data = await userModel.find()
            .skip((_page-1)*_size)
            .limit(_size)
            .exec();
            data.forEach((user)=>{
                list.push({
                    id: user._id,
                    name: user.name,
                    email: user.email
                })
            })
            const totalRecords = await userModel.countDocuments();
            return {
                totalRecords,
                data: list
            }
        },
        user: async(_, {id}, context) => {
            if (!context.user) {
                throw new Error('Unauthorized');
            }
            const user = await userModel.findOne({_id: id});
            if(!user){
                throw new Error("User not found")
            }
            return user
        },
        me: async(_, {}, context) => {
            
            if(!context.user){
                throw new Error('Unauthorized');
            }
            const user = userModel.findById({_id: context.user.id});
            return user
        }
    }
}

module.exports = {typeDefs, resolvers}