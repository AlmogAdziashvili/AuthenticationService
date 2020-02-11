# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.3.0 (11/02/2020)

### Added
- PUT /api/user/reset for starting password reset
- PUT /api/user/reset/:token for reseting the password

### Changed
- DELETE /api/user/:ID - changed to /api/user, pass id through the body

## 0.2.0 (10/02/2020)

### Added
- PUT /api/user for update currently logged user
- DELETE /api/user/:ID for removing a user with ID 