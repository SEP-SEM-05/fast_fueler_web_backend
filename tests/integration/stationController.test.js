process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const appMaker = require('../../app');
const app = appMaker.makeApp();
const conn = require('../../db_connection');

const auth = require("../../middleware/auth");

describe('Fuel Station endpoints', () => {

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

        it('ERROR: Should return an error for invalid id', (done) => {

            const id = "637a5598b3a1719e48f0c599";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/station/dashboard/${id}`)
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

        it('SUCCESS: Should return ok', (done) => {

            const id = "637a5598b3a1719e48f0c57d";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/station/dashboard/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('user');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Update Fuel Amount - Update the fuel amount of a fuel type", () => {

        it('SUCCESS: Should return ok', (done) => {

            const id = "6378f8e10e64b5dfda404b45";

            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_body = {
                registrationNo: "testOnlyStation99",
                fuelType: "Auto Diesel",
                addedAmount: "10.0"
            }

            request(app).post(`/station/updateamount`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send(req_body)
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Get Fuel Waiting Queues - Retrieve the waiting queue data from the database", () => {

        it('ERROR: Should return an error for invalid registration No.', (done) => {

            const id = "637a5598b3a1719e48f0c599";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/station/fuelqueues/testOnlyStation999`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('error');
                    expect(body).to.contain.property('error');
                    expect(res.statusCode).to.equal(500);

                    done();
                })
                .catch((err) => done(err));
        });

        it('SUCCESS: Should return the ok', (done) => {

            const id = "637a5598b3a1719e48f0c57d";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/station/fuelqueues/testOnlyStation99`)
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

    describe("Get Fuel Announced Queues - Retrieve the announced queue data from the database", () => {

        it('SUCCESS: Should return the ok', (done) => {

            const id = "637a5598b3a1719e48f0c57d";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/station/announcedqueues/testOnlyStation99`)
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

    describe("Get Fuel Active Queues - Retrieve the active queue data from the database", () => {

        it('SUCCESS: Should return the ok', (done) => {

            const id = "637a5598b3a1719e48f0c57d";
            let token_data = {
                userType: 'station',
                id: id,
                registrationNo: "testOnlyStation99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/get-activequeues/announcedqueues/testOnlyStation99`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;
                    console.log(body);
                    expect(body.length >= 0).to.equal(false);

                    done();
                })
                .catch((err) => done(err));
        });
    });
});


//request fuel