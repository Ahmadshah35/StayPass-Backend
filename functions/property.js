const propertyModel = require("../models/property");

const addProperty = async (req) => {
    const newProperty = new propertyModel(req.body);
    const result = await newProperty.save();
    return result
};

const getPropertyById = async (req) => {
    const { propertyId } = req.query;
    const property = await propertyModel.findById(propertyId);
    return property
};

const getAllProperties = async (req) => {
    const { name, ownerId, category, type, features, noOfRooms } = req.query;
    const filter = {};

    if(name){
        filter.propertyName = name
    };
    if(ownerId){
        filter.ownerId = ownerId
    };
    if(category){
        filter.category = category
    };
    if(type){
        filter.type = type
    };
    if(features){
        filter.features = features
    };
    if(noOfRooms){
        filter.noOfRooms = noOfRooms
    }

    const properties = await propertyModel.find(filter);
    return properties;
};

const nearbyProperties = async (req) => {
    const { longitude, latitude } = req.query;

    const location = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    const properties = await propertyModel.find({
         location:{
            $near:{
                $geometry: {
                    type: "Point",
                    coordinates: location.coordinates
                },
                $maxDistance: 1000
            }
        }
    });
    return properties;
};

const updateProperty = async (req) => {
    const { propertyId } = req.body;
    const updatedData = req.body;

    const property = await propertyModel.findByIdAndUpdate(propertyId, 
        { $set: updatedData },
        { new: true }
    );
    return property
};

const deleteProperty = async (req) => {
    const { propertyId } = req.query;
    const property = await propertyModel.findByIdAndDelete(propertyId);
    return property
};

module.exports = {
    addProperty,
    getPropertyById,
    getAllProperties,
    nearbyProperties,
    updateProperty,
    deleteProperty
};