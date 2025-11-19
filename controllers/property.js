const propertyFunctions = require("../functions/property");
const userModel = require("../models/user");

const addProperty = async (req, res) => {
  try {
    const property = await propertyFunctions.addProperty(req);
    if (!property) return res.status(400).json({success: false,message: "Property is Not Added!",});

    const categoryToField = {
      Sell: "forSale",
      Rent: "forRent",
      VocationalRent: "forVocationalRent",
      Lease: "forLease",
    };
    
    const userField = categoryToField[property.category];
    if (userField) {
      await userModel.findByIdAndUpdate(property.ownerId,{ $inc: { [userField]: 1 } },{ new: true });
    }
    return res.status(200).json({success: true,message: "Property Added Successfully!",data: property,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await propertyFunctions.getAllProperties(req);
    if (properties.length === 0) return res.status(400).json({success: false,message: "No Properties Found!",});
    return res.status(200).json({success: true,message: "All Properties!",data: properties,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await propertyFunctions.updateProperty(req);
    if (!property) return res.status(400).json({success: false,message: "No Property Found to Update!",});
    return res.status(200).json({success: true,message: "Property is Updated Successfully!",data: property,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await propertyFunctions.deleteProperty(req);
    if (!property) return res.status(400).json({success: false,message: "No Property Found to Delete!",});
    const categoryToField = {
      Sell: "forSale",
      Rent: "forRent",
      VocationalRent: "forVocationalRent",
      Lease: "forLease",
    };
    const userField = categoryToField[property.category];
    if (userField && property.ownerId) {
      await userModel.findByIdAndUpdate(property.ownerId,{ $inc: { [userField]: -1 } }, { new: true });
    }

    return res.status(200).json({success: true,message: "Property is Deleted Successfully!",});

  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  addProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
};
