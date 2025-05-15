# Party Map Backend

Welcome to the backend of the Party Map application, built with [NestJS](https://nestjs.com/). This backend serves as the API layer for managing and providing party-related data for the Party Map application.

## Table of Contents

- [Party Map Backend](#party-map-backend)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the Party Map backend, follow these steps:

1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Navigate to the backend directory: `cd backend`
3. Install the dependencies: `npm install`

## Configuration

Before running the application, you need to configure the following environment variables

You can either set these environment variables directly or create a `.env` file in the root directory of the backend and define them there.

## Running the Application

To run the Party Map backend, use the following command:

```bash
npm run start
```

This will start the backend server on `http://localhost:3000`.

## API Endpoints

The Party Map backend provides the following API endpoints:

- `/parties`: GET, POST, PUT, DELETE endpoints for managing parties.
- `/users`: GET, POST, PUT, DELETE endpoints for managing users.
- `/auth`: POST endpoint for user authentication.

For detailed information about each endpoint, refer to the [API documentation](api-documentation.md).

## Testing

To run the tests for the Party Map backend, use the following command:

```bash
npm run test
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

