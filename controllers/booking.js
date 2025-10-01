const bookingFunction = require("../functions/booking");

const createBooking = async (req, res) => {
    try {
        const booking = await bookingFunction.createBooking(req);
        return res.status(200).json({
            success: true,
            msg: "Booking Created Successfully!",
            data: booking
        })
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await bookingFunction.getBookingById(req);
        if(!booking){
            return res.status(200).json({
                success: false,
                msg: "No Booking Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Booking Details By Id!",
                data: booking
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingFunction.getAllBookings(req);
        if(bookings.length === 0){
            return res.status(200).json({
                success: false,
                msg: "No Bookings Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "All Bookings!",
                data: bookings
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getAllMonthlyBookings = async (req, res) => {
    try {
        const bookings = await bookingFunction.getAllBookingByMonth(req);
        if(bookings.length === 0){
            return res.status(200).json({
                success: false,
                msg: "No Bookings Found For this Month!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "All Bookings By Month!",
                data: bookings
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const updateBooking = async (req, res) => {
    try {
        const booking = await bookingFunction.updateBooking(req);
        if(!booking){
            return res.status(200).json({
                success: false,
                msg: "No Booking Found to Update!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Booking Details Updated!",
                data: booking
            })
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const deleteBooking = async (req, res) => {
    try {
        const booking = await bookingFunction.deleteBooking(req);
        if(!booking){
            return res.status(200).json({
                success: false,
                msg: "No Booking Found To be Deleted!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Booking is Deleted Successfully!"
            })            
        }
    } catch (error) {
        console.log("Having Errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

module.exports = {
    createBooking,
    getBookingById,
    getAllBookings,
    getAllMonthlyBookings,
    updateBooking,
    deleteBooking
};