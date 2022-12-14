process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// environmental variables
require('dotenv').config();

// DB connection to test database
const conn = require('../../../db_connection');

const Vehicle = require('../../../models/vehicle');
const Quota = require('../../../models/quota');
const Request = require('../../../models/request');

const { findVehicleByRegNo, findVehicleByRegNoAndEngNo, findAllByNic, updateStationsAndRegister, registerAll, getQuotas, updateFillingDetails, countEachTypeVehicle } = require('../../../services/vehicleDBHelper');

describe("Database access methods for vehicles", () => {

    beforeAll(async () => {

        // connect to mongodb and listen

        try {
            await conn.connect();
        } 
        catch (err) {
            console.log(err);
        }
    });

    afterAll(async () => {

        // close DB connection

        try {
            await conn.close();
        } 
        catch (err) {
            console.log(err);
        }
    });

    describe("findVehicleByRegNo - Find a vehicle that matches the given registration No.", () => {

        it("should return a null object for non exsisting registrtation No.", async () => {

            const vehicle = await findVehicleByRegNo('non-existing-regNo');

            expect(vehicle).toEqual(null);
        });

        it("should return a valid vehicle object for an exsisting registration No.", async () => {

            const exsistingRegNo = "sampleRegNo01";
            const mockVehicleId = "636d277d0753c9bd0a64146a"

            const quriedVehicle = await findVehicleByRegNo(exsistingRegNo);

            expect(quriedVehicle._id).toEqual(mongoose.Types.ObjectId(mockVehicleId));
        });
    });

    describe("findVehicleByRegNoAndEngNo - find a vehicle given the registration No. and the engine No.", () => {

        it("should return a null object for non exsisting registrtation No.", async () => {

            const mockRegNo = "non-existing-regNo";
            const mockEngNo = "sampleEngNo01";

            const vehicle = await findVehicleByRegNoAndEngNo(mockRegNo, mockEngNo);

            expect(vehicle).toEqual(null);
        });

        it("should return a null object for non exsisting engine No.", async () => {

            const mockRegNo = "sampleRegNo01";
            const mockEngNo = "non-existing-engNo";

            const vehicle = await findVehicleByRegNoAndEngNo(mockRegNo, mockEngNo);

            expect(vehicle).toEqual(null);
        });

        it("should return a valid vehicle object for an exsisting registration No. and engine No.", async () => {

            const mockRegNo = "sampleRegNo01";
            const mockEngNo = "sampleEngNo01";
            const mockVehicleId = "636d277d0753c9bd0a64146a";

            const vehicle = await findVehicleByRegNoAndEngNo(mockRegNo, mockEngNo);

            expect(vehicle._id).toEqual(mongoose.Types.ObjectId(mockVehicleId));
        });
    });

    describe("findAllByNic - Find vehicles that registered under a given nic", () => {

        //checks whether the database has any vehicles under the given nic
        //if there are not, should return null
        it("should return an empty array object if there are no vehicles under the provided nic", async () => {

            const mockNic = "non-existing-nic";

            const vehicles = await findAllByNic(mockNic);

            expect(vehicles).toEqual([]);
        });

        //checks whether the database has any vehicles under the given nic which are registered in the system
        //if there are not, should return null
        it("should return an empty array object if there are no vehicles registered in the system under the provided nic", async () => {

            const mockNic = "nicex01unreg";//this has vehicles owened by it. but those are not registered in the system

            const vehicles = await findAllByNic(mockNic);

            expect(vehicles).toEqual([]);
        });

        it("if there are vehicles registered under the given nic to the system, return them in an array", async () => {

            const mockNic = "657637925v";

            const vehicles = await findAllByNic(mockNic);

            expect(vehicles.length > 0).toBeTruthy();
        });
    });

    describe("registerAll - register all the vehicles matches a given registration No. array", () => {

        it("no document should be updated, given an empty array", async () => {

            const mockRegNos = [];

            const result = await registerAll(mockRegNos);

            expect(result.modifiedCount).toEqual(mockRegNos.length);
        });

        it("should update(register) all the vehicles corresponds to the registration numbers provided in the array", async () => {

            const mockRegNos = ['sampleRegNo05', 'sampleRegNo03'];

            const result = await registerAll(mockRegNos);

            expect(result.modifiedCount).toEqual(mockRegNos.length);
        });
    });

    describe("getQuotas - get all allowed fuel quotas", () => {

        it("should return an array of quota objects", async () => {

            const result01 = await getQuotas();
            const result02 = await Quota.find();

            expect(result01.length).toEqual(result02.length);
        });
    });

    describe("updateStationsAndRegister - update the station and mark as registered, given the registrationNo.", () => {

        it("should fail to update any document for an invalid registration No.", async () => {

            const mockRegNo = "mockRegNo111";
            const mockStations = ['stationRegNo01', 'stationRegNo02'];

            let result = await updateStationsAndRegister(mockRegNo, mockStations);

            expect(result.matchedCount).toEqual(0);
        });

        it("should update the stations of a particular vehicle with provided stations array for a valid registration No.", async () => {

            const mockRegNo = "testOnlyVehicle01";
            const mockStations = ['stationRegNo01', 'stationRegNo02'];

            let result = await updateStationsAndRegister(mockRegNo, mockStations);
            let quriedVehicle = await Vehicle.findOne({ registrationNo: mockRegNo });

            expect(quriedVehicle.stations).toEqual(mockStations);
        });
    });

    describe("updateFillingDetails - update the last filling details provided the registrationNo", () => {

        it("should update the given details of the given vehicle", async () => {

            const result = await updateFillingDetails("testOnlyVehicle01", null, 5);
            expect(result === null).toEqual(false);
        });
    });

    describe("countEachTypeVehicle - get count of given vehicle type and given fuel type", () => {

        it("should return a number of vehicles, given vehicle type and fuel type", async () => {

            const result = await countEachTypeVehicle("Petrol", "B-Car");

            expect(result !== null).toEqual(true);
        });
    });
});
