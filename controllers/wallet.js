const bookingModel = require("../models/booking");
const userModel = require("../models/user");
const walletModel = require("../models/wallet");

const paymentWithWallet = async (req, res) => {
  try {
    const { userId, bookingAmount, bookingId } = req.body;
    const amount = +bookingAmount; // ✅ ensure it's always a number
    const wallet = await walletModel.findOne({ userId: userId });
    let payableAmount = amount;

    if (!wallet || wallet.balance <= 0) return res.status(400).json({success: false,message: "No wallet balance available",});
    
    
    // ✅ Check if balance is equal or greater than booking amount
    if (wallet.balance >= amount) {
      wallet.balance -= amount;
      payableAmount = 0;

      wallet.transactions.push({type: "debit",amount: amount,description: "Full payment via wallet credits",});

      await wallet.save();
      const user = await userModel.findById(userId);
      user.walletBalance -= amount;
      await user.save();
  
      const booking = await bookingModel.findByIdAndUpdate({ _id: bookingId },{ $set: { status: "Accepted" } },{ new: true });
      if(booking?.propertyId?.ownerId){
        const update = await userModel.findByIdAndUpdate({ _id: booking.propertyId.ownerId },{ $inc: { walletBalance: amount } });
      }
      return res.status(200).json({ success: true, message: "Payment Successful using wallet", payableAmount, booking, });
    } else {
      return res.status(400).json({success: false,message: "Insufficient wallet balance",});
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
}

const getWalletByUserId = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await userModel.findById(_id);
    if (!user) return res.status(400).json({success: false,message: "User not found",});
    
    let wallet = await walletModel.findOne({ userId: _id });
    if (!wallet) {
      wallet = new walletModel({userId: _id,balance: 0,transactions: [],});
      await wallet.save();
    }

    return res.status(200).json({success: true,message: "Wallet fetched successfully",data: wallet,});
  } catch (error) {
    console.error("error:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
}

module.exports = {
  paymentWithWallet,
  getWalletByUserId,
};