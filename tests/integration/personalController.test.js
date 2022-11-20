process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const appMaker = require('../../app');
const app = appMaker.makeApp();
const conn = require('../../db_connection');

const auth = require("../../middleware/auth");

describe('Personal Client endpoints', () => {

    beforeAll(async () => {

        // connect to mongodb and listen

        try {
            await conn.connect();
        }
        catch (err) {
            console.log(err);
        }
    })

    afterAll(async () => {

        // close DB connection

        try {
            await conn.close();
        }
        catch (err) {
            console.log(err);
        }
    })

    describe("Get Dashboard - Retrieve the dashboard data from the database", () => {

        it('ERROR: Should return an authentication error for undefined tokens', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";

            request(app).get(`/personal/dashboard/${id}`)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('auth-error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(404);

                    done();
                })
                .catch((err) => done(err));
        });

        it('SUCCESS: Should return the nic of the user', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/personal/dashboard/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('nic');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Add Vehicle - Add a new personal vehicle", () => {

        it('ERROR: Should return an error for a non-existing registration NO.', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                nic: "testOnlyOwner",
                registrationNo: "nonExistingRegNo",
                engineNo: "testOnlyEngNo",
                stations: []
            }

            request(app).post(`/personal/addVehicle`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_data)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });

        it('ERROR: Should return an error for a non-existing owner', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                nic: "nonExsistingOwner",
                registrationNo: "testOnlyVehicle",
                engineNo: "testOnlyEngNo",
                stations: []
            }

            request(app).post(`/personal/addVehicle`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_data)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });

        it('ERROR: Should return an for an already registered vehicle', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                nic: "testOnlyOwner",
                registrationNo: "testOnlyVehicle",
                engineNo: "testOnlyEngNo",
                stations: []
            }

            request(app).post(`/personal/addVehicle`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_data)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Change Stations - Change stations of a vehicles", () => {

        it('ERROR: Should return an error for a non-existing user', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                nic: "nonExsistingOwner",
                registrationNo: "testOnlyVehicle",
                stations: []
            }

            request(app).post(`/personal/changeStations`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_data)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });

        it('SUCCESS: Should return STATUS OK', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                nic: "990972657v",
                registrationNo: "testOnlyVehicle",
                stations: []
            }

            request(app).post(`/personal/changeStations`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_data)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Get Unread Notification Count - Retrieve the unread notification count", () => {

        it('ERROR: Should return an error for non-existing user', (done) => {

            const id = "63357dc8ceafb5f66452a700";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/personal/notifyCount/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });

        it('SUCCESS: Should return unread notification count with status ok', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/personal/notifyCount/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('notifyCount');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Get All Notifications - Retrieve all the notifications belongs to a user", () => {

        it('ERROR: Should return an error for non-existing user', (done) => {

            const id = "63357dc8ceafb5f66452a700";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/personal/notifications/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(400);

                    done();
                })
                .catch((err) => done(err));
        });

        it('SUCCESS: Should return a notification array with status ok', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/personal/notifications/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('notifications');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Mark Notification As Read - Mark a notification as read", () => {

        it('SUCCESS: Should return status ok', (done) => {

            const id = "63357dc8ceafb5f66452a7ac";
            let token_data = {
                userType: 'personal',
                id: id,
                nic: "990972657v"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            const notf_id = "637a38cdb3a1719e48f0c578"

            request(app).get(`/personal/mark/${notf_id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');

                    done();
                })
                .catch((err) => done(err));
        });
    });
});


//request fuel