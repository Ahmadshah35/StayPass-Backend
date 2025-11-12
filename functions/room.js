const roomModel = require("../models/room");

const createRoom = async (req) => {
  const {propertyId,roomNo,roomType,roomName,maxOccupancy,bedType,window,privateBathrooms,facilities,pricePerNight,serviceCharges,blockedDates,} = req.body;
  const roomImages = req.files?.roomImages?.map((file) => file.filename) || [];
  const newRoom = new roomModel({
    propertyId,
    roomNo,
    roomType,
    roomName,
    maxOccupancy: Number(maxOccupancy),
    bedType,
    window,
    privateBathrooms,
    facilities: facilities ? JSON.parse(facilities) : [],
    pricePerNight: Number(pricePerNight),
    serviceCharges: Number(serviceCharges) || 0,
    blockedDates: blockedDates ? JSON.parse(blockedDates) : [],
    roomImages,
  });
  const savedRoom = await newRoom.save();
  return savedRoom;
};

const getAllRooms = async (req) => {
  const { roomId,propertyId } = req.query;
  const filter = {};
  if(propertyId) filter.propertyId = propertyId;
  if(roomId) filter._id = roomId;
  const rooms = await roomModel.find(filter).populate("propertyId").sort({ createdAt: -1 });
  return rooms;
};

const updateRoom = async (req) => {
  const { roomId } = req.body;
  const { ...roomData } = req.body;

  if (req.files?.roomImages) roomData.roomImages = req.files.roomImages.map((file) => file.filename);
  if (req.body.facilities) roomData.facilities = JSON.parse(req.body.facilities);
  if (req.body.blockedDates) roomData.blockedDates = JSON.parse(req.body.blockedDates);
  if (req.body.maxOccupancy) roomData.maxOccupancy = Number(req.body.maxOccupancy);
  if (req.body.pricePerNight) roomData.pricePerNight = Number(req.body.pricePerNight);
  if (req.body.serviceCharges) roomData.serviceCharges = Number(req.body.serviceCharges);

  const updatedRoom = await roomModel.findByIdAndUpdate(
    roomId,
    { $set: roomData },
    { new: true }
  );

  return updatedRoom;
};

const deleteRoom = async (req) => {
  const { roomId } = req.body;
  const deleted = await roomModel.findByIdAndDelete(roomId);
  return deleted
};

module.exports = {
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
