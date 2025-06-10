import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
should();

describe('/api/accounts-payable/get-expense-validations/:request_id', function () {
  it('Should return 200 for valid request ID', function (done) {
    request.execute(app)
      .get('/api/accounts-payable/get-expense-validations/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('request_id');
        res.body.should.have.property('Expenses').that.is.an('array');
        done();
      });
  });

  it('Should return 404 for non-existent request ID', function (done) {
    request.execute(app)
      .get('/api/accounts-payable/get-expense-validations/1000')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', 'Travel request not found');
        done();
      });
  });

  it('Should return 400 for invalid request ID format', function (done) {
    request.execute(app)
      .get('/api/accounts-payable/get-expense-validations/invalid')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should return empty expenses array for request with no expenses', function (done) {
    request.execute(app)
      .get('/api/accounts-payable/get-expense-validations/2')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('request_id');
        res.body.should.have.property('Expenses').that.is.an('array').and.is.empty;
        done();
      });
  });
}); 