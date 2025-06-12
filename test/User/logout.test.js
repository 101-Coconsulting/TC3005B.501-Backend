import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/user/logout', function () {
    it('Should return 200 and correct message for logout', function (done) {
        request(app)
        .get('/api/user/logout')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message', 'Sesión cerrada correctamente');
            done();
        });
    });
    
    
});