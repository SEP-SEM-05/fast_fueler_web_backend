process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// environmental variables
require('dotenv').config();

// DB connection to test database
const conn = require('../../../db_connection');

const Request = require('../../../models/request');
const {
    getAllReqByIds,
    getStationsOfReq,
    saveRequest,
    findWaitingAndActiveRequest,
    closeRequest
} = require('../../../services/requestDBHelper');

describe("Database access methods for requests", () => {
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

    describe("getAllReqByIds - get request object array", () => {

        it("should return the request array for given ids", async () => {

            const mockId_arr = ["6375ead731df776ccb303305", "6375eaaf31df776ccb300cde"];

            const requests = await getAllReqByIds(mockId_arr);

            expect(requests.length > 0).toBeTruthy();
        });
    });

    describe("getStationsOfReq - get station array of a request id", () => {

        it("should return the station array for given id", async () => {

            const mockId = "6375ead731df776ccb303305";

            const result = await getStationsOfReq(mockId);

            expect(result !== null).toBeTruthy();
        });
    });

    describe("saveRequest - save a fuel request to the database", () => {

        it("should return no error and the request should successfully save", async () => {

            const mockrequest = {
                "userID": "testOnlyId3",
                "userType": "testOnlyType",
                "registrationNo": "testOnlyRegNo3",
                "quota": 20,
                "fuelType": "Petrol 92 Octane",
                "requestedStations": ["0000000003", "0000000004"],
                "priority": 1
            };

            const result = await saveRequest(mockrequest);

            expect(result !== null).toBeTruthy();
        });
    });

    describe("findWaitingAndActiveRequest - find any waiting/active requests for a vehicle/organization given the registration No.", () => {

        it("should return the requests for given reg No and user type", async () => {

            const mockRegNo = "TestOnlyRegNo2";
            const mockUserType = "TestOnlyType";

            const result = await findWaitingAndActiveRequest(mockRegNo, mockUserType);

            expect(result !== null).toBeTruthy();
        });
    });

    describe("closeRequest - close the request after filling is done", () => {

        it("should close the request after filling is done", async () => {

            const mockRegId = "6375eaaf31df776ccb300cde";
            const mockFilledStation = null;
            const mockIsFilled = false;
            const mockFilledDate = null;
            const mockFilledAmount = 10;
            const mockState = "closed";

            const result = await closeRequest(mockRegId, mockFilledStation, mockIsFilled, mockFilledDate, mockFilledAmount, mockState);

            expect(result !== null).toBeTruthy();
        });
    });
});