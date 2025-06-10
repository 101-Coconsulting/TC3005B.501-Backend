import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';
import chaiHttp from 'chai-http';
import app from '../../index.js';
import pool from '../../database/config/db.js';

chai.use(chaiHttp);
should();

describe('/api/accounts-payable/validate-receipts/:request_id', function () {
  let conn;

  before(async function() {
    conn = await pool.getConnection();
    // Insert test data for valid case
    await conn.query(`
      INSERT INTO Request (request_id, request_status_id) 
      VALUES (1, 6)
      ON DUPLICATE KEY UPDATE request_status_id = 6
    `);
  });

  after(async function() {
    if (conn) {
      await conn.release();
    }
  });

  it('Should return 200 for valid request ID', function (done) {
    request.execute(app)
      .put('/api/accounts-payable/validate-receipts/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should return 200 for non-existent request ID (current behavior)', function (done) {
    request.execute(app)
      .put('/api/accounts-payable/validate-receipts/1000')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        done();
      });
  });

  it('Should return 400 for invalid request ID format', function (done) {
    request.execute(app)
      .put('/api/accounts-payable/validate-receipts/invalid')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should return 200 for request with no receipts (current behavior)', function (done) {
    request.execute(app)
      .put('/api/accounts-payable/validate-receipts/999')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message', 'All receipts approved. Request finalized.');
        res.body.should.have.property('updatedStatus', 8);
        done();
      });
  });
});