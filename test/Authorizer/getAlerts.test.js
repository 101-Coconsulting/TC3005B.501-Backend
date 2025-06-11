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
        res.body.should.be.an('array').and.not.be.empty;
        res.body.forEach((alert) => {
          expect(alert).to.be.an('object');
          expect(alert).to.have.property('alert_id');
          expect(alert).to.have.property('user_name');
          expect(alert).to.have.property('request_id');
          expect(alert).to.have.property('message_text');
          expect(alert).to.have.property('alert_date');
          expect(alert).to.have.property('alert_time');
        });
      });

    done();
  });

  it('Should return 200 and all matching alerts when n is 0 (no limit)', function (done) {
        request.execute(app)
            .get(`/api/authorizer/get-alerts/2/1/0`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array');
                res.body.should.have.lengthOf(13);
                res.body.forEach((alert) => {
                expect(alert).to.be.an('object');
                expect(alert).to.have.property('alert_id');
                expect(alert).to.have.property('user_name');
                expect(alert).to.have.property('request_id');
                expect(alert).to.have.property('message_text');
                expect(alert).to.have.property('alert_date');
                expect(alert).to.have.property('alert_time');
              });
                done();
            });
    });

  it('Should return 200 and empty array when no matching alerts are found', function (done) {

    request.execute(app)
      .get('/api/authorizer/get-alerts/999/999/0')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('array').and.be.empty;
      })

    done();
  });


  it('Should return 400 with invalid id', function (done) {

    request.execute(app)
      .get('/api/authorizer/get-alerts/invalid_id/999/0')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
      })

    done();
  });
});