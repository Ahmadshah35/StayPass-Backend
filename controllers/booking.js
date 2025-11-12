const bookingFunction = require("../functions/booking");

const createBooking = async (req, res) => {
  try {
    const booking = await bookingFunction.createBooking(req);
    if (!booking) return res.status(400).json({success: false,message: "Property could not be booked due to some reason",});
    return res.status(200).json({success: true,message: "Booking Created Successfully!",data: booking,});
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await bookingFunction.getBookingById(req);
    if (!booking) return res.status(400).json({ success: false, message: "No Booking Found!" });

    return res.status(200).json({success: true,message: "Booking Details By Id!",data: booking,});

  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingFunction.getAllBookings(req);
    if (bookings.length === 0) return res.status(400).json({success: false,message: "No Bookings Found!",});
    return res.status(200).json({success: true,message: "All Bookings!",data: bookings,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllMonthlyBookings = async (req, res) => {
  try {
    const bookings = await bookingFunction.getAllBookingByMonth(req);
    if (bookings.length === 0) return res.status(400).json({success: false,message: "No Bookings Found For this Month!",});
    return res.status(200).json({success: true,message: "All Bookings By Month!",data: bookings,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await bookingFunction.updateBooking(req);
    if (!booking) return res.status(400).json({success: false,message: "No Booking Found to Update!",});
    return res.status(200).json({success: true,message: "Booking Details Updated!",data: booking,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await bookingFunction.deleteBooking(req);
    if (!booking) return res.status(400).json({success: false,message: "No Booking Found To be Deleted!",});
    return res.status(200).json({success: true,message: "Booking is Deleted Successfully!",});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getAllBookings,
  getAllMonthlyBookings,
  updateBooking,
  deleteBooking,
};
