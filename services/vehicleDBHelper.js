let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();

const Vehicle = require('../models/vehicle');
const Quota = require('../models/quota');

//find a vehicle given the registration No.
const findVehicleByRegNo = async (registrationNo) => {

    let vehicle = await Vehicle.findOne({registrationNo});
    return vehicle;
}

//find a vehicle given the registration No. and the engine No.
const findVehicleByRegNoAndEngNo = async (registrationNo, engineNo) => {

    let vehicle = await Vehicle.findOne({registrationNo, engineNo});
    return vehicle;
}

//find the registered vehicles of a given personal client given the nic
const findAllByNic = async (nic) => {
    let vehicles = await Vehicle.find({ownerNIC: nic, isRegistered: true});
    return vehicles;
}

//update the station and mark as registered, given the registrationNo.
const updateStationsAndRegister = async (regNo, stations) => {
    let result = await Vehicle.updateOne({registrationNo: regNo}, {stations: stations, isRegistered: true});
    return result;
}

//register all the vehicles matches a given registration No. array
const registerAll = async (regNoArray) => {
    let result = await Vehicle.updateMany({registrationNo: { $in: regNoArray }}, {isRegistered: true});
    return result;
}

//get all allowed fuel quotas
const getQuotas = async () => {
    
    let quotas = await Quota.find();
    return quotas;
}

//update the last filling details provided the registrationNo
const updateFillingDetails = async (regNo, lastFilledDate, usedQuota) => {
    let result = await Vehicle.findOneAndUpdate({registrationNo: regNo}, {$set: {lastFilledDate}, $inc: {usedQuota}});
    return result;
}

//get count of each type of vehicles, given the fuel type
const countEachTypeVehicle = async (fuelType, vehType) => {

    let vehicleCount = await Vehicle.count({fuelType: fuelType, type: vehType, isRegistered: true});
    return vehicleCount;
}

const findAllByregistrationNoArray = async (regNoArray) => {
  let vehicles = await Vehicle.find({ registrationNo: { $in: regNoArray } });
  return vehicles;
};

module.exports = {
  findVehicleByRegNo,
  findVehicleByRegNoAndEngNo,
  findAllByNic,
  updateStationsAndRegister,
  registerAll,
  getQuotas,
  updateFillingDetails,
  countEachTypeVehicle,
  findAllByregistrationNoArray,
};