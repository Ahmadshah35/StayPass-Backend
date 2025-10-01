const express = require('express');
const router = express.Router();

const propertyController = require("../controllers/property");

router.post("/user/addProperty", propertyController.addProperty);
router.get("/user/getProperty", propertyController.getPropertyById);
router.get("/user/getAllProperties", propertyController.getAllProperties);
router.get("/user/nearbyProperties", propertyController.nearbyProperties);
router.post("/user/updateProperty", propertyController.updateProperty);
router.post("/user/deleteProperty", propertyController.deleteProperty);

module.exports = router;