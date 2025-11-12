const contactModel = require("../models/contact");

const createContactForm = async (req) => {
    const newContactForm = new contactModel(req.body);
    const result = await newContactForm.save();
    return result 
};

const getContactForm = async (req) => {
    const { formId } = req.query;
    const form = await contactModel.findById(formId);
    return form
};

const getAllContactForms = async (req) => {
    const { ownerId, userId, contactFormId, propertyId } = req.query;
    const filter = {};
    if(ownerId) filter.ownerId = ownerId
    if(userId) filter.userId = userId
    if(propertyId) filter.propertyId = propertyId
    if(contactFormId) filter._id = contactFormId

    const forms = await contactModel.find(filter).populate("ownerId","-password").populate("userId","-password").populate("propertyId");
    return forms
};

const deleteContactForm = async (req) => {
    const { contactFormId } = req.body;
    const form = await contactModel.findByIdAndDelete(contactFormId);
    return form
};

module.exports = {
    createContactForm,
    getContactForm,
    getAllContactForms,
    deleteContactForm
};