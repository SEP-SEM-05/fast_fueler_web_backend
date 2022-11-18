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
                .set('x-refresh-token',  refreshToken)
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
});