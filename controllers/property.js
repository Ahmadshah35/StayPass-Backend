const propertyFunctions = require("../functions/property");

const addProperty = async (req, res) => {
    try {
        const property = await propertyFunctions.addProperty(req);
        if(!property){
            return res.status(200).json({
                success: false,
                msg: "Property is Not Added!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Property Added Successfully!",
                data: property
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }
};

const getPropertyById = async (req, res) => {
    try {
        const property = await propertyFunctions.getPropertyById(req);
        if(!property){
            return res.status(200).json({
                success: false,
                msg: "No Property Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Property Details By Id!",
                data: property
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }    
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await propertyFunctions.getAllProperties(req);
        if( properties.length === 0 ){
            return res.status(200).json({
                success: false,
                msg: "No Properties Found!"
            })
        } else {    
            return res.status(200).json({
                success: true,
                msg: "All Properties!",
                data: properties
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }    
};

const updateProperty = async (req, res) => {
    try {
        const property = await propertyFunctions.updateProperty(req);s
        if(!property){
            return res.status(200).json({
                success: false,
                msg: "No Property Found to Update!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Property is Updated Successfully!",
                data: property
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }    
};

const nearbyProperties = async (req, res) => {
    try {
        const properties = await propertyFunctions.nearbyProperties(req);
    if( properties.length === 0 ){
            return res.status(200).json({
                success: false,
                msg: "No Nearby Properties Found!"
            })
        } else {    
            return res.status(200).json({
                success: true,
                msg: "All Nearby Properties!",
                data: properties
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }    
};

const deleteProperty = async (req, res) => {
    try {
        const property = await propertyFunctions.deleteProperty(req);
        if(!property){
            return res.status(200).json({
                success: false,
                msg: "No Property Found to Delete!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Property is Deleted Successfully!",
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }
};

module.exports = {
    addProperty,
    getPropertyById,
    getAllProperties,
    updateProperty,
    nearbyProperties,
    deleteProperty
};