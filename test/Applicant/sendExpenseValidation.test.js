import * as chai from 'chai';
const { expect, should } = chai;
import chaiHttp, { request } from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
should();

describe('PUT /api/applicant/send-expense-validation/:request_id', function () {
  it('Should return 200 when request status is 6', function (done) {
    request.execute(app)
      .put('/api/applicant/send-expense-validation/6')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('request_id', 6);
        expect(res.body).to.have.property('updated_status', 7);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('Should return 404 when request does not exist', function (done) {
    request.execute(app)
      .put('/api/applicant/send-expense-validation/9999')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('Should return 400 when status is not 6', function (done) {
    request.execute(app)
      .put('/api/applicant/send-expense-validation/1')
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
