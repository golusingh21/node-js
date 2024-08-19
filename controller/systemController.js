const countryData = require('../jsonData/country.json')
const stateData = require('../jsonData/state.json')
const cityData = require('../jsonData/city.json')

async function getCountries(req, res){
    try{
        let list = [];
        countryData.forEach((country)=>{
            list.push({
                id: country.id,
                name: country.name
            })
        })
        return res.status(200).json({
            data: list,
            totalRecords: list.length
        })
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function getStates(req, res){
    try{
        const {countryId} = req.params
        let list = [];
        if(!countryId){
            return res.status(400).json({
                message: "Country Id is required"
            })
        }
        const data = stateData.filter((state)=>state.country_id===Number(countryId))
        data.forEach((state)=>{
            list.push({
                id: state.id,
                name: state.name
            })
        })
        return res.status(200).json({
            data: list,
            totalRecords: list.length
        })
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function getCities(req, res){
    try{
        const {stateId} = req.params
        let list = [];
        if(!stateId){
            return res.status(400).json({
                message: "State Id is required"
            })
        }
        const data = cityData.filter((city)=>city.state_id===Number(stateId))
        data.forEach((city)=>{
            list.push({
                id: city.id,
                name: city.name
            })
        })
        return res.status(200).json({
            data: list,
            totalRecords: list.length
        })
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

const systemController = {
    getCountries,
    getStates,
    getCities
}
module.exports = systemController;