import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();


describe('/api/user/get-travel-requests/:dept_id/:status_id/:n?', function () {

    it('Should return 200', function (done) {

        request.execute(app)
            .get(`/api/user/get-travel-requests/2/1/5`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(5);
                expect(res.body[0]).to.have.property('request_id');
                expect(res.body[0]).to.have.property('user_id');
                expect(res.body[0]).to.have.property('destination_country');
                expect(res.body[0]).to.have.property('beginning_date');
                expect(res.body[0]).to.have.property('ending_date');
                expect(res.body[0]).to.have.property('request_status');
                done();
            });
    });

    it('Should return 200 when n is omitted', function (done) {

        request.execute(app)
            .get(`/api/user/get-travel-requests/2/1`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(13);
                done();
            });
    });

    it('Should return 404 when no travel requests are found', function (done) {

        request.execute(app)
            .get(`/api/user/get-travel-requests/999/99`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error', 'No travel requests found');
                done();
            });
    });

});