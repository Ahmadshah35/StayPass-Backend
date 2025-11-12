const propertyModel = require("../models/property");
const roomModel = require("../models/room");

const addProperty = async (req) => {
    let { longitude, latitude, locationName, features, amenities } = req.body;    
    const images = req.files?.images?.map((file) => file.filename) || [];
    const coverImage = req.files?.coverImage?.map((file) => file.filename) || [];    
    let location = {};
    if (latitude && longitude) {
        location = {
          type: "Point",
          coordinates: [parseFloat(longitude),parseFloat(latitude),],
          locationName: locationName || null,
        };
    }    
    if (features && typeof features === "string") features = JSON.parse(features);
    if (amenities && typeof amenities === "string") amenities = JSON.parse(amenities);    

    const newProperty = await propertyModel.create({
      ...req.body,
      images,
      coverImage,
      location,
      locationName: locationName || null,
      features,
      amenities,
    });    
    return newProperty;
};

const getPropertyById = async (req) => {
    const { propertyId } = req.query;
    const property = await propertyModel.findById(propertyId);
    return property
};

const getPropertyByPropertyId = async (propertyId) => {
    const property = await propertyModel.findById(propertyId);
    return property
};

const getAllProperties = async (req) => {
  const {propertyId,name,ownerId,category,type,features,noOfRooms,longitude,latitude,} = req.query;

  const filter = {};

  if (longitude && latitude) {
    filter.location = {
      $near: {
        $geometry: {type: "Point",coordinates: [parseFloat(longitude), parseFloat(latitude)],},
        $maxDistance: 10000, 
      },
    };
  }
  if(propertyId) filter._id = propertyId
  if (name) filter.propertyName = { $regex: name, $options: "i" };
  if (ownerId) filter.ownerId = ownerId;
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (noOfRooms) filter.noOfRooms = noOfRooms 
  if (features) {
    const parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
    filter.features = { $in: parsedFeatures };
  }

  const properties = await propertyModel.find(filter).populate("rooms") .sort({ createdAt: -1 }); 
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
          $geometry: {type: "Point",coordinates: location.coordinates},
          $maxDistance: 10000
        }
      }
    });
    return properties;
};

const updateProperty = async (req) => {
  const { propertyId } = req.body;
  const { ...propertyData } = req.body;

  if (req.files?.images) propertyData.images = req.files.images.map((file) => file.filename);
  if (req.files?.coverImages) propertyData.coverImages = req.files.coverImages.map((file) => file.filename);
  
  if (req.body.features) propertyData.features = JSON.parse(req.body.features);
  if (req.body.amenities) propertyData.amenities = JSON.parse(req.body.amenities);
    

  if (req.body.latitude && req.body.longitude) {
    propertyData.location = {
      type: "Point",
      coordinates: [parseFloat(req.body.longitude),parseFloat(req.body.latitude),],
      locationName : req.body.locationName || null
    };
    propertyData.locationName = req.body.locationName || null;
  }

  const updatedProperty = await propertyModel.findByIdAndUpdate(
    propertyId,
    { $set: { ...propertyData } },
    { new: true }
  );
  return updatedProperty;
};

const addPropertyRoom = async (propertyId, roomId) => {
  const updatedProperty = await propertyModel.findByIdAndUpdate(
    propertyId,
    { $push: { rooms: roomId } },
    { new: true }
  );
  return updatedProperty;
};

const removePropertyRoom = async (propertyId, roomId) => {
  const updatedProperty = await propertyModel.findByIdAndUpdate(
    propertyId,
    { $pull: { rooms: roomId } },
    { new: true }
  );
  return updatedProperty;
};

const deleteProperty = async (req) => {
    const { propertyId } = req.query;
    const property = await propertyModel.findByIdAndDelete(propertyId);
    const propertyRoom = await roomModel.deleteMany({propertyId:propertyId})
    return property
};


const updatePropertyAvgRating = async (id, avgRating ,totalReviews) => {
  const updatedProfile = await propertyModel.findByIdAndUpdate(
    id,
    { $set: { avgRating: avgRating,totalReviews:totalReviews } },
    { new: true }
  );
  return updatedProfile;
};

module.exports = {
    addProperty,
    getPropertyById,
    getAllProperties,
    nearbyProperties,
    updateProperty,
    deleteProperty,
    getPropertyByPropertyId,
    addPropertyRoom,
    removePropertyRoom,
    updatePropertyAvgRating
};