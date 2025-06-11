import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/get-alerts/:dept_id/:status_id/:n', function () {

    it('Should return 200 non-empty array', function (done) {

    request.execute(app)
      .get('/api/authorizer/get-alerts/1/1/5')
      .end((err, res) => {
        res.should.have.status(200);
      })

    done();
  });

  it('Should return 200 and all matching alerts when n is 0 (no limit)', function (done) {
        request.execute(app)
            .get(`/api/authorizer/get-alerts/2/1/0`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(13);
                done();
            });
    });

  it('Should return 200 and empty array when no matching alerts are found', function (done) {

    request.execute(app)
      .get('/api/authorizer/get-alerts/999/999/0')
      .end((err, res) => {
        res.should.have.status(200);
      })

    done();
  });


  it('Should return 400 with invalid id', function (done) {

    request.execute(app)
      .get('/api/authorizer/get-alerts/invalid_id/999/0')
      .end((err, res) => {
        res.should.have.status(400);
      })

    done();
  });
});