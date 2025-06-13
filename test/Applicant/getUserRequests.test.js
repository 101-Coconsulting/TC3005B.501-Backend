import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/applicant/get-user-requests/1', function () {

  it('Should return 200', function (done) {

    request.execute(app)
      .get('/api/applicant/get-user-requests/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
      })

    done();
  });

  it('Should include the correct params', function (done) {

    request.execute(app)
      .get('/api/applicant/get-user-requests/1')
      .end((err, res) => {
        res.body.forEach(request => {
          expect(request).to.be.an('object');
          expect(request).to.have.property('request_id');
          expect(request).to.have.property('destination_country');
          expect(request).to.have.property('beginning_date');
          expect(request).to.have.property('ending_date');
          expect(request).to.have.property('status');
        });
      })

    done();
  });

  it('Should return err 404', function (done) {

    request.execute(app)
      .get('/api/applicant/get-user-requests/999999')
      .end((err, res) => {
        res.should.have.status(404);
      })

    done();
  });

});
