import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/authorizer/authorize-travel-request/2/4', function () {

  it('Should return 200', function (done) {

    request.execute(app)
      .put('/api/authorizer/authorize-travel-request/2/4')
      .end((err, res) => {
        res.should.have.status(200);
      })

    done();
  });

  it('Should return err 400 when unauthorized', function (done) {

    request.execute(app)
      .put('/api/authorizer/authorize-travel-request/4/1')
      .end((err, res) => {
        res.should.have.status(400);
        res.should.have.property("message");
      })

    done();
  });

});