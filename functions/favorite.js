const favoriteModel = require("../models/favorite");
const propertyModel = require("../models/property");

const addToFavorites = async (userId, propertyId) => {
  const event= await propertyModel.findByIdAndUpdate(
    propertyId,
    { $addToSet: { favoriteBy: userId } },
    { new: true }
  );
  return event;
};

const createFavorite = async (userId, propertyId) => {
  const favorite= await favoriteModel.create({ userId, propertyId });
  return favorite;
};

const removeFavorite = async (userId, propertyId) => {
  const event = await propertyModel.findByIdAndUpdate(
    propertyId,
    { $pull: { favoriteBy: userId } },
    { new: true }
  );
  return event;
};

const deleteFavorite = async (userId, propertyId) => {
  const favorite = await favoriteModel.findOneAndDelete({ userId, propertyId });
  return favorite;
};

const getFavorites = async (userId) => {
  const favorite = await favoriteModel.find({ userId }).populate("propertyId");
  return favorite;
};

module.exports = {
  addToFavorites,
  removeFavorite,
  createFavorite,
  deleteFavorite,
  getFavorites,
};
