const {gql} = require('apollo-server');
const countryData = require('../jsonData/country.json')
const statesData = require('../jsonData/state.json')
const cityData = require('../jsonData/city.json')

// Define the GraphQL schema
const typeDefs = gql`
    type Country {
        id: ID
        name: String,
        phoneCode: String,
        currency: String,
        currencySymbol: String,
        currencyName: String
    }

    type States{
        id: ID!,
        name: String,
    }

    type Cities{
        id: ID!,
        name: String
    }

    type Query{
        countries: [Country]
        states(id: ID!): [States]
        cities(id: ID!): [Cities]
    }
`

// Define the resolvers
const resolvers = {
    Query: {
        countries: async () => {
            let list = [];
            countryData.forEach((country)=>{
                list.push({
                    id: country.id, 
                    name: country.name,
                    phoneCode: country.phone_code,
                    currency: country.currency,
                    currencySymbol: country.currency_symbol,
                    currecnyName: country.currency_name
                })
            })
            return list
        },
        states: async (parent, args) => {
            const {id} = args;
            const data = statesData.filter((state)=>state.country_id==id);
            return data
        },
        cities: async(parent, args) => {
            const {id} = args;
            const data = cityData.filter((city)=>city.state_id==id)
            return data
        }
    }
}

module.exports = {typeDefs, resolvers}