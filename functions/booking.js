const moment = require("moment");
const bookingModel = require("../models/booking");
const propertyModel = require("../models/property");
const roomModel = require("../models/room");
const { default: mongoose } = require("mongoose");

const createBooking = async (req) => {
  const {
    userId,
    propertyId,
    roomId,
    name,
    phone,
    email,
    checkInDate,
    checkOutDate,
    noOfOccupancy,
  } = req.body;

  const checkIn = moment(checkInDate, "DD-MM-YYYY");
  const checkOut = moment(checkOutDate, "DD-MM-YYYY");
  if (!checkIn.isValid() || !checkOut.isValid() || !checkOut.isAfter(checkIn)) {
    throw new Error("Invalid check-in/check-out dates");
  }

  const property = await propertyModel.findById(propertyId);
  const room = await roomModel.findById(roomId);
  if (!property || !room) throw new Error("Property or Room not found");

  // ✅ Generate BookingDates array (exclude check-out day)
  let BookingDates = [];
  let temp = moment(checkIn);
  while (temp.isBefore(checkOut)) {
    BookingDates.push(temp.format("DD-MM-YYYY"));
    temp.add(1, "days");
  }

  // ✅ Check for overlapping bookings
  const existingBookings = await bookingModel.find({ roomId });
  const overlapping = existingBookings.some((b) => {
    const bCheckIn = moment(b.checkInDate, "DD-MM-YYYY");
    const bCheckOut = moment(b.checkOutDate, "DD-MM-YYYY");
    return checkIn.isBefore(bCheckOut) && checkOut.isAfter(bCheckIn);
  });
  if (overlapping)
    throw new Error("This room is already booked for your selected dates");

  // ✅ Check against blockedDates in the room
  const blockedConflict = BookingDates.some((date) =>
    room.blockedDates.includes(date)
  );
  if (blockedConflict)
    throw new Error("This room is blocked for some of your selected dates");

  const noOfNights = BookingDates.length;

  const totalCost =
    (room.pricePerNight + (room.serviceCharges || 0)) * noOfNights;

  const booking = await bookingModel.create({
    userId,
    propertyId,
    roomId,
    name,
    phone,
    email,
    totalCost,
    checkInDate,
    checkOutDate,
    BookingDates,
    noOfOccupancy,
    noOfNights,
    roomSerialNo: room.roomNo,
    status: "Confirmed",
    // status: "Pending",
  });

  // ✅ Return success with property checkin/checkout times
  console.log("first", property.checkinTime,)
  return {
    booking,
    propertyCheckInTime: property.checkinTime,
    propertyCheckOutTime: property.checkoutTime,
  };
};

const getBookingById = async (req) => {
  const { bookingId } = req.query;
  const booking = await bookingModel.findById(bookingId);
  return booking;
};

const getAllBookings = async (req) => {
  const { userId, status, roomId } = req.query;
  const filter = {};

  if (userId) filter.userId = userId;
  if (status) filter.status = status;
  if (roomId) filter.roomId = roomId;

  const bookings = await bookingModel.find(filter);
  return bookings;
};

const updateBooking = async (req) => {
  const { bookingId } = req.body;
  const updatedData = req.body;

  const booking = await bookingModel.findByIdAndUpdate(
    bookingId,
    { $set: updatedData },
    { new: true }
  );
  return booking;
};

const deleteBooking = async (req) => {
  const { bookingId } = req.body;
  const booking = await bookingModel.findByIdAndDelete(bookingId);
  return booking;
};

const getAllBookingByMonth = async (req) => {
  const { roomId, month, year } = req.query;

  const bookings = await bookingModel.aggregate([
    {$match: { roomId: new mongoose.Types.ObjectId(roomId),},},
    {$addFields: {checkInDateObj: {$dateFromString: {dateString: "$checkInDate",format: "%d-%m-%Y",},},},},
    {$match: {$expr: {$and: [{ $eq: [{ $month: "$checkInDateObj" }, Number(month)] },{ $eq: [{ $year: "$checkInDateObj" }, Number(year)] },],},},},
    {$project: {_id: 1,roomId: 1,checkInDate: 1,checkOutDate: 1,name: 1,totalCost: 1,},},
  ]);

  return bookings;
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  getAllBookingByMonth,
  updateBooking,
  deleteBooking,
};
