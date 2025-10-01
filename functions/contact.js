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
    const { } = req.query;
    const filter = {};

    const forms = await contactModel.find(filter);
    return forms
};

const deleteContactForm = async (req) => {
    const { formId } = req.body;
    const form = await contactModel.findByIdAndDelete(formId);
    return form
};

module.exports = {
    createContactForm,
    getContactForm,
    getAllContactForms,
    deleteContactForm
};