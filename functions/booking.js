const bookingModel = require("../models/booking");

const createBooking = async (req) => {
    const newBooking = new bookingModel(req.body);
    const result = await newBooking.save();
    return result
};

const getBookingById = async (req) => {
    const { bookingId } = req.query;
    const booking = await bookingModel.findById(bookingId);
    return booking;
};

const getAllBookings = async (req) => {
    const { vendorId, userId, status, roomId } = req.query;
    const filter = {};

    if(vendorId){
        filter.vendorId = vendorId
    };
    if(userId){
        filter.userId = userId
    };
    if(status){
        filter.status = status
    };
    if(roomId){
        filter.roomId = roomId
    };

    const bookings = await bookingModel.find(filter);
    return bookings
};

const updateBooking = async (req) => {
    const { bookingId } = req.body;
    const updatedData = req.body;
    
    const booking = await bookingModel.findByIdAndUpdate(bookingId, 
        { $set: updatedData },
        { new: true }
    );
    return booking
};

const deleteBooking = async (req) => {
    const { bookingId } = req.body;
    const booking = await bookingModel.findByIdAndDelete(bookingId);
    return booking
};

const getAllBookingByMonth = async (req) => {
    const bookings = await bookingModel.aggregate([
       {
         $match: {
           roomId: new mongoose.Types.ObjectId(roomId)
         }
       },
       {
         $addFields: {
           checkInDateObj: {
             $dateFromString: {
               dateString: "$checkInDate",
               format: "%d-%m-%Y"
             }
           }
         }
       },
       {
         $match: {
           $expr: {
             $and: [
               { $eq: [{ $month: "$checkInDateObj" }, month] },
               { $eq: [{ $year: "$checkInDateObj" }, year] }
             ]
           }
         }
       },
       {
         $project: {
           _id: 1,
           roomId: 1,
           checkInDate: 1,
           checkOutDate: 1,
           name: 1,
           totalCost: 1
         }
       }
     ]);

     return bookings;    
};

module.exports = {
    createBooking,
    getBookingById,
    getAllBookings,
    getAllBookingByMonth,
    updateBooking,
    deleteBooking
};