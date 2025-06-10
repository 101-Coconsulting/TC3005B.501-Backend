import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/admin/get-user-list', function () {

  it('Should return 200', function (done) {
    request.execute(app)
      .get('/api/admin/get-user-list')
      .end((err, res) => {
        res.should.have.status(200);
      })

    done();
  });

  it('Should include the correct params', function (done) {

    request.execute(app)
      .get('/api/admin/get-user-list')
      .end((err, res) => {
        res.body.forEach(user => {
          expect(user).to.be.an('object');
          expect(user).to.have.property('user_id');
          expect(user).to.have.property('user_name');
          expect(user).to.have.property('email');
          expect(user).to.have.property('role_name');
          expect(user).to.have.property('department_name');
        });
      })

    done();
  });

});