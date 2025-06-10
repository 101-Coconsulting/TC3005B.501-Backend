import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/user/get-travel-request/:request_id', function () {

  it('Should return 200 for valid request ID', function (done) {

    request.execute(app)
      .get('/api/user/get-travel-request/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('request_id');
        done();
      });
  });

  it('Should return 404 for non-existent request ID', function (done) {

    request.execute(app)
      .get('/api/user/get-travel-request/1000')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', 'Travel request not found');
        done();
      });
  });

  it('Should return 400 for invalid request ID format', function (done) {

    request.execute(app)
      .get('/api/user/get-travel-request/invalid')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should include the correct params', function (done) {

    request.execute(app)
      .get('/api/user/get-travel-request/1')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('request_id');
        expect(res.body).to.have.property('request_status');
        expect(res.body).to.have.property('notes');
        expect(res.body).to.have.property('requested_fee');
        expect(res.body).to.have.property('imposed_fee');
        expect(res.body).to.have.property('request_days');
        expect(res.body).to.have.property('creation_date');
        
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.be.an('object');
        expect(res.body.user).to.have.property('user_name');
        expect(res.body.user).to.have.property('user_email');
        expect(res.body.user).to.have.property('user_phone_number');
        

        expect(res.body).to.have.property('routes');
        expect(res.body.routes).to.be.an('array');
        
        if (res.body.routes.length > 0) {
          res.body.routes.forEach(route => {
            expect(route).to.be.an('object');
            expect(route).to.have.property('router_index');
            expect(route).to.have.property('origin_country');
            expect(route).to.have.property('origin_city');
            expect(route).to.have.property('destination_country');
            expect(route).to.have.property('destination_city');
            expect(route).to.have.property('beginning_date');
            expect(route).to.have.property('beginning_time');
            expect(route).to.have.property('ending_date');
            expect(route).to.have.property('ending_time');
            expect(route).to.have.property('hotel_needed');
            expect(route).to.have.property('plane_needed');
          });
        }
      })

    done();
  });

});