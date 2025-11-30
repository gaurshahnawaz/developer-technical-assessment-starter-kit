# Backend - Real Estate Platform API

NestJS backend API for the Real Estate Platform.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- Swagger UI: http://localhost:3000/api

## Environment Variables

See `.env.example` for required environment variables.

## Database

The application connects to PostgreSQL using TypeORM. Ensure the database is running and configured in `.env`.

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
