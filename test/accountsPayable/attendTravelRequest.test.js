import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/accounts-payable/attend-travel-request/4', function () {

  it('Should return 200', function (done) {

    request.execute(app)
      .put('/api/accounts-payable/attend-travel-request/4')
      .send({ imposed_fee: 1000.00 })
      .end((err, res) => {
        res.should.have.status(200);
      })

    done();
  });

  it('Should return err 404', function (done) {

    request.execute(app)
      .put('/api/accounts-payable/attend-travel-request/1000')
      .send({ imposed_fee: 500.00 })
      .end((err, res) => {
        res.should.have.status(404);
      })

    done();
  });

});