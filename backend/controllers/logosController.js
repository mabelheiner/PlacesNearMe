const Logo = require('../models/logoModel')

const getAllLogos = async (req, res) => {
    res.json('get all logos')
}

const getLogoByName = async (req, res) => {
    //console.log('Req received', req.params.name)
    const logoInfo = await Logo.findOne({name: req.params.name})
    //console.log('Logo url found', logoInfo)

    if (logoInfo.logoUrl){
        res.status(200).json({logoUrl: logoInfo.logoUrl})
    } else {
        const newReq = {
            body : {
                name: req.params.name
            }
        }
        requestLogoToBeAdded(newReq, res)
    }
}

const requestLogoToBeAdded = async (req, res) => {
    //console.log('Req.body received', req.body)

    const nameInDatabase = await Logo.findOne({name: req.body.name});
    //console.log('Name in database', nameInDatabase)

    if (nameInDatabase) {
        nameInDatabase.count += 1
        const updatedCount = await nameInDatabase.save();
        //console.log('updated name request', updatedCount)
        res.status(200).json({message: 'We will update that logo soon.'})
    } else {        
        const logoRequest = {
            name: req.body.name   
        }

        try {
            const newLogo = new Logo(logoRequest)
            await newLogo.save()

            //console.log('Logo request posted')
            res.status(200).json({message: 'Your request has been sent.'})
        } catch (error) {
            //console.log('Error', error)
            res.status(400).json({message: 'Error in requesting logo', error: error})
        }
    }
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