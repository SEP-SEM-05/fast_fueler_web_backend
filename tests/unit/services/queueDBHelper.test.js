process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// environmental variables
require('dotenv').config();

// DB connection to test database
const conn = require('../../../db_connection');

const Queue = require("../../../models/queue");
const {
    addToQueue,
    findQueuesByRegNoAndFuel,
    findQueuesByStRegNo,
    addNewAnnouncedQueue,
    removeReqsFromWaitingQueue,
    findAllQueuesAndUpdateByRegNos,
    updateEndTime,
    updateQueue,
    findQueueById,
    updateSlectedAmount,
} = require("../../../services/queueDBHelper");

describe("Database access methods for queue", () => {
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
    
    describe("addToQueue - add a fuel request to queues of all the station given a queue id array", () => {

        it("should add the list of queue into the database", async () => {
            const mockQueue_ids = ["6375b9f031df776ccbf95820", "6375ba1831df776ccbf9821c"];
            const mockReqId = "testOnlyReqId";

            const result = await addToQueue(mockQueue_ids, mockReqId);
            expect(result === null).toEqual(false);
        });
    });

    describe("findQueuesByRegNoAndFuel - get any exsisting announneced/waiting queues given the registration No. of the station and the fuel type", () => {

        it("should return the list of queues ", async () => {
            const mockRegNos = ["testOnlyStation1", "testOnlyStation2"];
            const mockFuelType = "testOnly";

            const result = await findQueuesByRegNoAndFuel(mockRegNos, mockFuelType);
            expect(result === []).toEqual(false);
        });
    });

    describe("findQueuesByStRegNo - get all the queues of a given station", () => {

        it("should return the list of queues ", async () => {
            const mockStId = ["testOnlyStation1", "testOnlyStation2"];
            const mockStates = ["announced"];

            const result = await findQueuesByStRegNo(mockStId, mockStates);
            expect(result === []).toEqual(false);
        });
    });

    describe("addNewAnnouncedQueue - add new announced queue for a station", () => {

        it("should return no error and the queue should successfully save", async () => {
            const mockRegNo = "testOnlyStation2";
            const mockFuelType = "testOnly";
            const mockRequests = [];
            const mockQueueStartTime = null;
            const mockEstimatedEndTime = null;
            const mockState = "waiting";
            const mockVehicleCount = 5;
            const mockSelectedAmount = 3;

            const result = await addNewAnnouncedQueue(mockRegNo, mockFuelType, mockRequests, mockQueueStartTime, mockEstimatedEndTime, mockState, mockVehicleCount, mockSelectedAmount);
            expect(result === null).toEqual(false);
        });
    });

    describe("removeReqsFromWaitingQueue - remove announced requests from waiting queue", () => {

        it("should return no error and the request should successfully remove", async () => {
            const mockRegNo = "testOnlyStation2";
            const mockFuelType = "testOnly";
            const mockRequests = ["633eee8dfbd4e99ee76466b3","633eee8dfbd4e99ee76466b4"];

            const result = await removeReqsFromWaitingQueue(mockRegNo, mockFuelType, mockRequests);
            expect(result.matchedCount == 0).toEqual(false);
        });
    });

    describe("findAllQueuesAndUpdateByRegNos - find all Queues by regNo array and update", () => {

        it("should return no error and the queues should successfully update", async () => {
            const mockRegNos = ["testOnlyStation1"];
            const mockFuelType = "testOnly";
            const mockRequests = ["633eee8dfbd4e99ee76466b3"];

            const result = await findAllQueuesAndUpdateByRegNos(mockRegNos, mockFuelType, mockRequests);
            expect(result.matchedCount == 0).toEqual(false);
        });
    });

    describe("updateEndTime - update the estimated end time given the id", () => {

        it("should update the endTime of queue ", async () => {
            const mockId = "6375c669d356a8e0d2882b59";
            const mockEndTime = null;

            const result = await updateEndTime(mockEndTime, mockId);
            expect(result === null).toEqual(false);
        });
    });

    describe("updateQueue - update the queue", () => {

        it("should update the queue for given queue id ", async () => {
            const mockId = "6375c669d356a8e0d2882b59";
            const mockEndTime = null;
            const mockState = "announced";

            const result = await updateQueue(mockId, mockState, mockEndTime);
            expect(result === null).toEqual(false);
        });
    });

    describe("findQueueById - find a fuel queue provided the _id", () => {

        it("should return the queue for given queue id ", async () => {
            const mockId = "6375c669d356a8e0d2882b59";

            const result = await findQueueById(mockId);
            expect(result === null).toEqual(false);
        });
    });

    describe("updateSlectedAmount - update selected amount of the queue", () => {

        it("should update selected amount of the queue for given queue id ", async () => {
            const mockId = "6375c669d356a8e0d2882b59";
            const mockSelectedamount = 10;

            const result = await updateSlectedAmount(mockId, mockSelectedamount);
            expect(result === null).toEqual(false);
        });
    });
});