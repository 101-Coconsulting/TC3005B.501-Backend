import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/user/get-user-data/:user_id', () => {
  it('Should return 200 for valid user ID', async () => {
    const res = await request(app)
      .get('/api/user/get-user-data/1')
      .set('Authorization', 'Bearer your-test-token-here');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('user_id');
  });

  it('Should return 404 for non-existent user ID', async () => {
    const res = await request(app)
      .get('/api/user/get-user-data/1000')
      .set('Authorization', 'Bearer your-test-token-here');
    
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('message', 'User not found');
  });

  it('Should return 400 for invalid user ID format', async () => {
    const res = await request(app)
      .get('/api/user/get-user-data/invalid')
      .set('Authorization', 'Bearer your-test-token-here');
    
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('message', 'Invalid user ID format');
  });

  it('Should include the correct user data properties', async () => {
    const res = await request(app)
      .get('/api/user/get-user-data/1')
      .set('Authorization', 'Bearer your-test-token-here');
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.all.keys([
      'user_id',
      'user_name',
      'email',
      'role_name',
      'department_name',
      'phone_number'
    ]);
  });
});

