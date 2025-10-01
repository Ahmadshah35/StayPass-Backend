const reviewFunction = require("../functions/review");

const addReview = async (req, res) => {
    try {
        const review = await reviewFunction.addReview(req);
        if(!review){
            return res.status(200).json({
                success: false,
                msg: "Review Not Added!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Review Added Successfully!",
                data: review
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getReviewById = async (req, res) => {
    try {
        const review = await reviewFunction.getReviewById(req);
        if(!review){
            return res.status(200).json({
                success: false,
                msg: "Review Not Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Review Details By Id!",
                data: review
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewFunction.getAllReviews(req);
        if(reviews.length === 0){
            return res.status(200).json({
                success: false,
                msg: "No Reviews Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "All Reviews Found!",
                data: reviews
            })
        }
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
}

const updateReviews = async (req, res) => {
    try {
        const review = await reviewFunction.updateReview(req);
        if(!review){
            return res.status(200).json({
                success: false,
                msg: "Review Not Found to Updated!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Review Details updated Successfully!",
                data: review
            })
        }        
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await reviewFunction.deleteReview(req);
        if(!review){
            return res.status(200).json({
                success: false,
                msg: "Review Not Found to Delete!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Review Deleted Successfully!",
                data: review
            })
        }        
    } catch (error) {
        console.log("Having Errors:", error)
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

module.exports = {
    addReview,
    getReviewById,
    getAllReviews,
    updateReviews,
    deleteReview
};