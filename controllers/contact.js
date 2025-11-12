const contactFunctions = require("../functions/contact");

const createContactForm = async (req, res) => {
  try {
    const form = await contactFunctions.createContactForm(req);
    if (!form) return res.status(400).json({success: false,message: "ContactForm is Not Added!",});
    return res.status(200).json({success: true,message: "ContactForm Added Successfully!",data: form,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllContactForms = async (req, res) => {
  try {
    const form = await contactFunctions.getAllContactForms(req);
    if (form.length === 0) return res.status(400).json({success: false,message: "No ContactForm Found!",});
    return res.status(200).json({success: true,message: "All ContactForm!",data: form,});
    
  } catch (error) {
    console.log("Having Errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const deleteContactForm = async (req, res) => {
  try {
    const form = await contactFunctions.deleteContactForm(req);
    if (!form) return res.status(400).json({success: false,message: "No ContactForm Found to Delete!",});
    return res.status(200).json({success: true,message: "ContactForm is Deleted Successfully!",});

  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  createContactForm,
  getAllContactForms,
  deleteContactForm
};
