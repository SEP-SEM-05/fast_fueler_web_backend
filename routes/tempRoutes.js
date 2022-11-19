const express = require('express');
const tempController = require('../controllers/tempController');

const router = express.Router();

router.post('/addPerVehicle', tempController.add_per_vehicles);
router.post('/addOrgVehicle', tempController.add_org_vehicles);
router.post('/addStations', tempController.add_stations);
router.post('/addOrgs', tempController.add_orgs);

module.exports = router;