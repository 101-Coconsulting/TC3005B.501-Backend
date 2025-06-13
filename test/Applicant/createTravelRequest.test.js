import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/applicant/get-cc/1', function () {

  it('Creating simple Travel request', function (done) {

    let travelRequest = {
      "router_index": 0,
      "notes": "Important meeting",
      "requested_fee": 1000,
      "imposed_fee": 500,
      "origin_country_name": "Mexico",
      "origin_city_name": "CDMX",
      "destination_country_name": "Japón",
      "destination_city_name": "Tokio",
      "beginning_date": "2025-02-15",
      "beginning_time": "08:00:00",
      "ending_date": "2025-02-22",
      "ending_time": "19:00:00",
      "plane_needed": true,
      "hotel_needed": false,
      "additionalRoutes": []
    }


    request.execute(app)
      .post('/api/applicant/create-travel-request/1')
      .send(travelRequest)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });

  });

  it('Creating multiple destination Travel request', function (done) {

    let travelRequest = {
      "router_index": 0,
      "notes": "Business trip",
      "requested_fee": 1000,
      "imposed_fee": 500,
      "origin_country_name": "Mexico",
      "origin_city_name": "CDMX",
      "destination_country_name": "Argentina",
      "destination_city_name": "Buenos Aires",
      "beginning_date": "2025-02-15",
      "beginning_time": "08:00:00",
      "ending_date": "2025-02-22",
      "ending_time": "19:00:00",
      "plane_needed": true,
      "hotel_needed": true,
      "additionalRoutes": [
        {
          "router_index": 1,
          "origin_country_name": "Argentina",
          "origin_city_name": "Buenos Aires",
          "destination_country_name": "Chile",
          "destination_city_name": "Santiago",
          "beginning_date": "2025-02-23",
          "beginning_time": "09:00:00",
          "ending_date": "2025-02-25",
          "ending_time": "18:00:00",
          "plane_needed": true,
          "hotel_needed": false
        },
        {
          "router_index": 1,
          "origin_country_name": "Chile",
          "origin_city_name": "Santiago",
          "destination_country_name": "Colombia",
          "destination_city_name": "Bogota",
          "beginning_date": "2025-02-23",
          "beginning_time": "09:00:00",
          "ending_date": "2025-02-25",
          "ending_time": "18:00:00",
          "plane_needed": true,
          "hotel_needed": false
        }
      ]
    }



    request.execute(app)
      .post('/api/applicant/create-travel-request/1')
      .send(travelRequest)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });

  });


  it('Sending Bad Travel request', function (done) {

    let travelRequest = {
      "router_index": 0,
      "notes": "Email Testorio",
      "beginning_time": "08:00:00",
      "ending_date": "2025-02-22",
      "ending_time": "19:00:00",
      "plane_needed": true,
      "hotel_needed": false,
      "additionalRoutes": [
      ]
    }



    request.execute(app)
      .post('/api/applicant/create-travel-request/1')
      .send(travelRequest)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });

  });

});
