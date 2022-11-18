const express = require('express');

const adminController = require('../controllers/adminController');

const auth = require('../middleware/auth');

const router = express.Router();

//get dashboard info
router.get('/dashboard/:fueltype', auth.requireAuth, adminController.get_dashboard);

//update fuel quota
router.post("/updatequota", auth.requireAuth, adminController.update_fuel_quota);

//get registered station info
router.get('/registered', auth.requireAuth, adminController.get_registered_station);

//get unregistered station info
router.get('/unregistered', auth.requireAuth, adminController.get_unregistered_station);

//get newly registered station info
router.get('/newlyregistered', auth.requireAuth, adminController.get_newlyregistered_station);

//get count of registered stations
router.get('/count/:stationType', auth.requireAuth, adminController.get_count_registered_station);

//register as newly registered station
router.post("/registerstation", auth.requireAuth, adminController.register_station);

//register all as newly registered stations
router.post("/registerallstation", auth.requireAuth, adminController.register_all_station);

// update the station as ongoing station
router.post("/updatestation", auth.requireAuth, adminController.update_station_state);

// send email to station
router.post("/sendemail", auth.requireAuth, adminController.send_email);

// send email to many station
router.post("/sendmanyemail", auth.requireAuth, adminController.send_email_to_all);

//get all personal clients info
router.get('/personalclient', auth.requireAuth, adminController.get_clients);

//get all personal client vehicles info
router.get('/personalvehicle', auth.requireAuth, adminController.get_personal_vehicles);

//find the personal registered vehicles of a given vehicle type
router.get('/typepersonalvehicle', auth.requireAuth, adminController.get_type_personal_vehicles);

//get all org client vehicles info
router.get('/orgvehicle', auth.requireAuth, adminController.get_org_vehicles);

//find one type vehicles of an organization using the registration No. array
router.get('/typeorgvehicle', auth.requireAuth, adminController.get_type_org_vehicles);

//find each vehicle count for each fuel type
router.get('/countvehicle', auth.requireAuth, adminController.get_count_vehicle);


module.exports = router;