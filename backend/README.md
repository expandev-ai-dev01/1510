# Plutus Backend API

Backend API for Plutus - Personal Finance Control System

## Description

Simple personal finance control system allowing users to record expenses and income without login for quick daily use.

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Microsoft SQL Server
- **Validation**: Zod

## Project Structure

```
src/
├── api/                    # API controllers
│   └── v1/                 # API version 1
│       ├── external/       # Public endpoints
│       └── internal/       # Authenticated endpoints
├── routes/                 # Route definitions
│   └── v1/                 # Version 1 routes
├── middleware/             # Express middleware
├── services/               # Business logic
├── utils/                  # Utility functions
├── constants/              # Application constants
├── instances/              # Service instances
├── config/                 # Configuration
├── tests/                  # Global test utilities
└── server.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- SQL Server
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Update database credentials in `.env`

### Development

Run development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Start Production

Start production server:
```bash
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Linting

Run ESLint:
```bash
npm run lint
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### API Versioning

All API endpoints are versioned:

```
/api/v1/external/...  # Public endpoints
/api/v1/internal/...  # Authenticated endpoints
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |
| API_VERSION | API version | v1 |
| DB_SERVER | Database server | localhost |
| DB_PORT | Database port | 1433 |
| DB_USER | Database user | sa |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | plutus |
| DB_ENCRYPT | Enable encryption | true |
| CORS_ORIGINS | Allowed origins | localhost:3000,localhost:3001,localhost:5173 |

## License

ISC