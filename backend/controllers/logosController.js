const Logo = require('../models/logoModel')

const getAllLogos = async (req, res) => {
    res.json('get all logos')
}

const getLogoByName = async (req, res) => {
    res.json('get logo by name')
}

const addLogo = async (req, res) => {
    res.json('add logo')
}

const updateLogo = async (req, res) => {
    res.json('update logo')
}

const deleteLogo = async (req, res) => {
    res.json('delete logo')
}

module.exports = {
    getAllLogos,
    getLogoByName,
    addLogo,
    updateLogo,
    deleteLogo
}