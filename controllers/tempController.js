let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();

const Vehicle = require('../models/vehicle');
const Station = require('../models/station');
const Organization = require('../models/organization');

const auth = require('../middleware/auth');
const encHandler = require('../middleware/encryptionHandler');

const add_per_vehicles = async (req, res) => {

    
}

const add_org_vehicles = async (req, res) => {

    
}

const add_stations = async (req, res) => {

    
}

const add_orgs = async (req, res) => {

    
}

module.exports = {
    add_per_vehicles,
    add_org_vehicles,
    add_stations,
    add_orgs,
}