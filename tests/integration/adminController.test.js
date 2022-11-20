process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

require("dotenv").config();

const appMaker = require('../../app');
const app = appMaker.makeApp();
const conn = require('../../db_connection');

const auth = require("../../middleware/auth");

const admin_username = process.env.ADMIN_USERNAME;

describe('Admin endpoints', () => {

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

        it('ERROR: Should return an error for undefined fuel type', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/dashboard/something`)
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

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/dashboard/Petrol`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('quota');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Update Fuel Quota - Update the quota amount of a vehicle type", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_body = {
                vehicleType: "testOnlyType",
                fuelType: "Petrol",
                newAmount: "10.0"
            }

            request(app).post(`/admin/updatequota`)
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

    describe("Get Registered Stations - Retrieve the registered stations data from the database", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/registered`)
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

    describe("Register Station - Register a newly registered station", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_body = {
                registrationNo: "testOnlyStation99"
            }

            request(app).post(`/admin/registerstation`)
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

    describe("Update Station State - Update a station state as ongoing", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_body = {
                registrationNo: "testOnlyStation99"
            }

            request(app).post(`/admin/updatestation`)
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

    describe("Get Station Count - Retrieve the stations count data from the database", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/count/ioc`)
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

    describe("Get Unregistered Stations - Retrieve the unregistered stations data from the database", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/unregistered`)
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

    describe("Get Newly Registered Stations - Retrieve the newly registered stations data from the database", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/newlyregistered`)
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

    describe("Get Vehicle Count - Retrieve the vehicle count of all vehicle types from the database", () => {

        it('SUCCESS: Should return ok', (done) => {

            let token_data = {
                userType: 'admin',
                username: admin_username
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/admin/countvehicle`)
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