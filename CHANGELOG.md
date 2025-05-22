# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]: Request Follow-Up + Login + Configuration (TBC)

### Added

#### DB
- Automatic DB Setup
- Fix: Requests without a Route
- File Repository for Receipts

#### Security

- Data sanitization and validation.

#### API

- CPP receipt verification.
- Request Draft Functionalities
- Account Administration

> [!NOTE]
These features might still be changed depending on the progress made by the corresponding teams.

# Features Included in **this** Release

## [0.1.0] - 2025-05-07: Pre-Trip Flow

### Added

- DB Scheme
- Dummy Data Setup for Use.
- Certificates can be generated to use https protocol.
- User Request and Profile data fetching.
- Travel Request Creation


## [0.2.0] - 2025-05-21: Request Follow-Up

### Added

- View a User's requests (active + completed)
- Authorizers can retrieve travel requests that they need to attend according to their role.
- Authorizers can change the status of a travel request according to certain role and status conditions.
- Travel Agents can change the status of a travel request according to certain role and status conditions.
- Request Modification
- Request Cancellation

## [0.3.0] - 2025-05-21: Post-Trip Flow

### Added

- Create an expense validation

## [0.4.0] - 2025-05-21: Configuration

### Added

- Obtain a list of all the users

[unreleased]: https://github.com/101-Coconsulting/TC3005B.501-Backend/compare/v0.1.0...HEAD  
[0.1.0]: https://github.com/101-Coconsulting/TC3005B.501-Backend/releases/tag/v0.1.0
