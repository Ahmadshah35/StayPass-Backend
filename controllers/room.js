const roomFunctions = require("../functions/room");
const propertyFunctions = require("../functions/property")

const createRoom = async (req, res) => {
  try {
    const property = await propertyFunctions.getPropertyByPropertyId(req.body.propertyId);
    if(!property) return res.status(400).json({success: false,message: "Property not found",});
    const room = await roomFunctions.createRoom(req);
    if (!room) return res.status(400).json({success: false,message: "Room is Not Added!",});
    const propertyRoom = await propertyFunctions.addPropertyRoom(room.propertyId,room._id);
    return res.status(200).json({success: true,message: "Room Added Successfully!",data: room,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllRooms = async (req, res) => {
  try {
    const room = await roomFunctions.getAllRooms(req);
    if (room.length === 0) return res.status(400).json({success: false,message: "No Room Found!",});
    return res.status(200).json({success: true,message: "All Rooms!",data: room,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await roomFunctions.updateRoom(req);
    if (!room) return res.status(400).json({success: false,message: "No Room Found to Update!",});
    return res.status(200).json({success: true,message: "Room is Updated Successfully!",data: room,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};


const deleteRoom = async (req, res) => {
  try {
    const room = await roomFunctions.deleteRoom(req);
    if (!room) return res.status(400).json({success: false,message: "No Room Found to Delete!",});
    const remove = await propertyFunctions.removePropertyRoom(room.propertyId,room._id)
    return res.status(200).json({success: true,message: "Room is Deleted Successfully!",});

  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  createRoom,
  updateRoom,
  getAllRooms,
  deleteRoom,
};
