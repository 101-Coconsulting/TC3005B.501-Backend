# Changelog 🥥

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2025-06-12: Login + Configuration

### Security

- Validation and sanitization of endpoints and databases
- JWT authentication for endpoint authentication
- Improve encryption method

### Added

- Testing of endpoints.
- Create one or multiple users
- Delete a user
- Edit a user
- Login

## [0.3.0] - 2025-05-27: Post-Trip Flow

### Security

- Input validation

### Added

- Send an Applicant's receipts to Accounts Payable
- Approval or Rejection of a Receipt
- Create an expense validation
- Obtain a user's total balance in order to request a refund or payment
- Creating and submitting a Request Draft
- File Repository for Receipts
- Automatic DB Setup

### Changed

- Obtaining a user's information will now include their department and whether
  or not they are active

- Import SQL Files rather than creating a pool during the Setup

- Dummy Data to more accurately represent a company

## [0.2.0] - 2025-05-21: Request Follow-Up

### Added

- View a User's requests (active + completed)

- Authorizers can retrieve travel requests that they need to attend according
  to their role.

- Authorizers can change the status of a travel request according to certain
  role and status conditions.

- Travel Agents can change the status of a travel request according to certain
  role and status conditions.

- Request Modification

- Request Cancellation

### Fix

- Requests without a Route

## [0.1.0] - 2025-05-21: Pre-Trip Flow

### Security

- Certificates can be generated to use https protocol.

### Added

- DB Scheme.

- Dummy Data Setup for Use.

- User Request and Profile data fetching.

- Travel Request Creation.

- Applicant can retrieve data of completed or cancelled requests.

[0.1.0]: https://github.com/101-Coconsulting/TC3005B.501-Backend/releases/tag/v0.1.0
[0.2.0]: https://github.com/101-Coconsulting/TC3005B.501-Backend/releases/tag/v0.2.0
[0.3.0]: https://github.com/101-Coconsulting/TC3005B.501-Backend/releases/tag/v0.3.0
[0.4.0]: https://github.com/101-Coconsulting/TC3005B.501-Backend/releases/tag/v0.4.0
