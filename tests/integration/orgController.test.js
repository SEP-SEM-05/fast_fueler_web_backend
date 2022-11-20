process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const appMaker = require('../../app');
const app = appMaker.makeApp();
const conn = require('../../db_connection');

const auth = require("../../middleware/auth");

describe('Organization endpoints', () => {

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

            const id = "637a454fb3a1719e48f0c599";

            request(app).get(`/org/dashboard/${id}`)
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

        it('SUCCESS: Should return the registrationNo of the user', (done) => {

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/dashboard/${id}`)
                .set('x-access-token', accessToken)
                .set('x-refresh-token', refreshToken)
                .send()
                .then((res) => {

                    const body = res.body;

                    expect(body.status).to.equal('ok');
                    expect(body).to.contain.property('org_regNo');

                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("Get Vehicles - Retrieve all vehicles of an organization", () => {

        it('ERROR: Should return an error for non-existing user', (done) => {

            const id = "63357dc8ceafb5f66452a700";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/getVehicles/${id}`)
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

        it('SUCCESS: Should return the registrationNo of the user', (done) => {

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/dashboard/${id}`)
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

    describe("Change Stations - Change stations of an organization", () => {

        it('ERROR: Should return an error for a non-existing user', (done) => {

            const id = "637a454fb3a1719e48f0c599";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                registrationNo: "nonExsistingOwner",
                stations: []
            }

            request(app).post(`/org/changeStations`)
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

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            let req_data = {
                registrationNo: "testOnlyOrg99",
                stations: []
            }

            request(app).post(`/org/changeStations`)
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
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/notifyCount/${id}`)
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

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/notifyCount/${id}`)
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
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/notifications/${id}`)
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

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            request(app).get(`/org/notifications/${id}`)
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

            const id = "637a454fb3a1719e48f0c57a";
            let token_data = {
                userType: 'organization',
                id: id,
                registrationNo: "testOnlyOrg99"
            };

            const refreshToken = "Bearer " + auth.createRefreshToken(token_data);
            const accessToken = "Bearer " + auth.createAccessToken(token_data);

            const notf_id = "637a38cdb3a1719e48f0c578"

            request(app).get(`/org/mark/${notf_id}`)
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