process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');

// environmental variables
require('dotenv').config();

// DB connection to test database
const conn = require('../../../db_connection');

const Notification = require('../../../models/notification');
const {addNewNotification, addNewNotifications, getUnreadNotificationCount, getNotifications, mark_as_read} = require('../../../services/notificationDBHelper');

describe("Database access methods for Notifications", () => {
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

    describe("addNewNotification - Add a new notification for clients", () => {

        it("should return no error and the notification should successfully save", async () => {

            const mockRegNo = Date.now().toString().substring(2); //random
            const mockNotification = {
                "regNo": mockRegNo,
                "title": "testOnlyTitle",
                "msg": "testOnlyMsg"
            };

            const result = await addNewNotification(mockNotification);

            expect(result !== null).toEqual(true);
        });
    });

    describe("addNewNotifications - Add many new notification for clients", () => {

        it("should return no error and the notifications are successfully saved", async () => {

            const mockNotification = [
                {
                    "regNo": "mockRegNo1",
                    "title": "testOnlyTitle1",
                    "msg": "testOnlyMsg1"
                },
                {
                    "regNo": "mockRegNo2",
                    "title": "testOnlyTitle2",
                    "msg": "testOnlyMsg2"
                }

            ];

            const result = await addNewNotifications(mockNotification);

            expect(result !== null).toEqual(true);
        });
    });

    describe("getUnreadNotificationCount - Find the unread notifications count of given client", () => {
        it("should return a null object for non exsisting reg.no", async () => {
            const notification = await getUnreadNotificationCount("testOnlyStation");

            expect(notification).toEqual(0);
        });

        it("should return non-zero amount of notifications", async () => {
            const quriedNotification = await getUnreadNotificationCount("mockRegNo1");

            expect(quriedNotification > 0 ).toEqual(true);
        });
    });

    describe("getNotifications - Find the notifications of given client", () => {

        it("should return Notifications for an given reg.no", async () => {
            const quriedNotifications = await getNotifications("mockRegNo1");

            expect(quriedNotifications !== null ).toEqual(true);
        });
    });
    describe("mark_as_read - mark the notification state as read", () => {

        it("should return Notification state as read", async () => {
            const quriedNotification = await mark_as_read("mockRegNo2");

            expect(quriedNotification.matchedCount > 0 ).toEqual(true);
        });
    });
});