import expressAsyncHandler from "express-async-handler"
import settingModel from "../../models/settingModel.js"


// @des     Get app settings
// @route   POST /api/v1/settings
// @access  Public
const getSettings = expressAsyncHandler(async(req, res, next )=> {
    let settings = await settingModel.findOne()
    if(!settings) settings = await settingModel.create({})  //default values appear after creating document, even it's empty doc {}
    
    res.status(200).json({
        settings
    })
})

// @des     Update app settings
// @route   PUT /api/v1/settings
// @access  Private / admin-manger
const updateSettings = expressAsyncHandler(async(req, res, next )=> {
    let settings = await settingModel.findOne()
    if(!settings) settings = await settingModel.create(req.body)
    else settings = await settingModel.findOneAndUpdate({}, req.body, {new: true})

    res.status(200).json({
        settings
    })
})

export {
    getSettings,
    updateSettings
}