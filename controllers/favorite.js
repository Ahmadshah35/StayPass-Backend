const favoriteFunc = require("../functions/favorite");
const propertyFunc = require("../functions/property");

const addOrRemoveFavorite = async (req, res) => {
  try {
    const { userId, propertyId } = req.body;

    const property = await propertyFunc.getPropertyByPropertyId(propertyId);
    if (!property) return res.status(400).json({success: false,message: "property not found.",});
    
    const isFavorite = property.favoriteBy.includes(userId);

    if (isFavorite) {
      await favoriteFunc.removeFavorite(userId, propertyId);
      await favoriteFunc.deleteFavorite(userId, propertyId);

      return res.status(200).json({success: true,message: "Property removed from favorites successfully.",});
    } else {
      await favoriteFunc.addToFavorites(userId, propertyId);
      const favorite = await favoriteFunc.createFavorite(userId, propertyId);

      return res.status(200).json({success: true,message: "Property added to favorites successfully.",data: favorite,});
    }
  } catch (error) {
    console.error("Error in addOrRemoveFavorite:", error);
    return res.status(400).json({success: false,message: "Something went wrong",error: error.message,});
  }
};

const getFavorites = async (req, res) => {
  try {
    const  userId  = req.user;

    const favorites = await favoriteFunc.getFavorites(userId);
    if (!favorites || favorites.length === 0) return res.status(400).json({success: false,message: "No favorites found for this user.",data: [],});

    return res.status(200).json({success: true,message: "Favorites retrieved successfully.",data: favorites,});
  } catch (error) {
    console.error("Error in getFavorites:", error);
    return res.status(400).json({success: false,message: "Something went wrong",error: error.message,});
  }
};

module.exports = {
  addOrRemoveFavorite,
  getFavorites,
};
