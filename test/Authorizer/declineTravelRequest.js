import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/authorizer/decline-travel-request/2/4', function () {

  it('Should return 200', function (done) {

    request.execute(app)
      .put('/api/authorizer/decline-travel-request/2/4')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property("message", "Request declined successfully");
        res.body.should.have.property("new_status", "Rechazado");
      })

    done();
  });

  it('Should return err 400 when unauthorized', function (done) {

    request.execute(app)
      .put('/api/authorizer/decline-travel-request/2/1')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property("error", "User role not authorized to decline request");
      })

    done();
  });

});