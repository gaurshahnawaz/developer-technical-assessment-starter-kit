# Real Estate Platform – Technical Assessment

This repository contains a complete solution for the **Oman Housing Bank – Developer Technical Assessment**.  
It is a full-stack Real Estate platform with a modern landing page, property marketplace, and comprehensive property/land/project management system.

## 🎯 Project Overview

The Real Estate Platform is built with modern technologies to provide a seamless experience for browsing and managing properties, lands, and real estate projects:

- **Frontend:** React 18 + TypeScript + Vite  
- **Backend:** NestJS + TypeScript + TypeORM  
- **Database:** PostgreSQL  
- **Authentication:** JWT (JSON Web Tokens)  
- **Caching:** Redis (Cache Manager)  
- **Containerization:** Docker & Docker Compose  
- **Documentation:** Swagger/OpenAPI

---

## 📁 Repository Structure

```
.
├── Projects/
│   ├── backend/                          # NestJS Backend API
│   │   ├── src/
│   │   │   ├── app.module.ts            # Main app module
│   │   │   ├── app.controller.ts        # App routes
│   │   │   ├── main.ts                  # Entry point
│   │   │   ├── seed.ts                  # Database seeder
│   │   │   ├── properties/              # Properties module (CRUD operations)
│   │   │   ├── lands/                   # Lands module
│   │   │   ├── projects/                # Projects module
│   │   │   ├── listings/                # Listings & Search module
│   │   │   ├── agent-contacts/          # Agent contact requests module
│   │   │   ├── analytics/               # Analytics module
│   │   │   ├── auth/                    # Authentication & JWT
│   │   │   ├── users/                   # User management
│   │   │   ├── cache/                   # Caching service
│   │   │   └── common/                  # Shared utilities & interceptors
│   │   ├── test/                        # E2E tests
│   │   ├── Dockerfile                   # Backend container
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── README.md
│   │
│   ├── frontend/                        # React Frontend Application
│   │   ├── src/
│   │   │   ├── App.tsx                  # Main app component
│   │   │   ├── main.tsx                 # Entry point
│   │   │   ├── pages/
│   │   │   │   ├── LandingPage.tsx      # Home/landing page
│   │   │   │   ├── MarketplacePage.tsx  # Property marketplace
│   │   │   │   ├── PropertyDetailPage.tsx
│   │   │   │   ├── LandDetailPage.tsx
│   │   │   │   └── ProjectDetailPage.tsx
│   │   │   ├── components/              # Reusable components
│   │   │   │   ├── PropertyCard.tsx
│   │   │   │   ├── LandCard.tsx
│   │   │   │   ├── ProjectCard.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── AdvancedSearch.tsx
│   │   │   │   ├── ImageGallery.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── services/
│   │   │   │   └── api.ts               # API client (Axios)
│   │   │   ├── types/                   # TypeScript interfaces
│   │   │   └── utils/                   # Helper functions
│   │   ├── Dockerfile                   # Frontend container
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── database/
│       ├── script.sql                   # Database schema, indexes & seed data
│       └── seed-large-dataset.sql       # Large dataset for testing
│
├── sample data/
│   └── images/                          # Sample images for properties, lands, projects
│       ├── lands/
│       ├── projects/
│       └── properties/
│
├── docker-compose.yml                   # Multi-container orchestration
├── docker-start.sh                      # Start containers (Linux/Mac)
├── docker-stop.sh                       # Stop containers (Linux/Mac)
├── setup-docker.ps1                     # Windows setup script
├── setup-docker.bat                     # Windows batch setup
├── start.sh                             # Start development servers
├── stop.sh                              # Stop development servers
├── status.sh                            # Check server status
├── verify-setup.sh                      # Verify setup
└── README.md
```

---

## ✨ Key Features

### Frontend Features
- 🏠 **Landing Page** - Modern homepage with featured properties, projects, and lands
- 🔍 **Advanced Search** - Search properties with multiple filters (price, type, location, etc.)
- 📱 **Responsive Design** - Mobile-friendly UI built with React + CSS
- 🖼️ **Image Gallery** - Interactive image gallery for property details
- 🛒 **Marketplace** - Browse and filter properties, lands, and projects
- ⭐ **Featured Listings** - Highlight popular properties and projects
- 📊 **Property Details** - Comprehensive property information and pricing
- 🤝 **Agent Contact** - Request information from real estate agents

### Backend Features
- 🔐 **JWT Authentication** - Secure user registration and login
- 📊 **CRUD Operations** - Full CRUD for properties, lands, projects, users
- 🔍 **Advanced Search** - Powerful search with filters and pagination
- 📈 **Analytics** - Price history, market trends, local insights
- 💾 **Caching** - Redis-based caching for performance optimization
- 🗂️ **Agent Contacts** - Manage agent contact requests
- 📋 **Listings Management** - Unified listing search across properties, lands, projects
- 📚 **Swagger Documentation** - Auto-generated API documentation
- 🧪 **E2E Tests** - Comprehensive test coverage

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20+
- **npm** v10+
- **PostgreSQL** (optional if using Docker)
- **Docker & Docker Compose** (optional, for containerized setup)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gaurshahnawaz/developer-technical-assessment-starter-kit.git
   cd developer-technical-assessment-starter-kit
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd Projects/backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd Projects/frontend
   npm install
   ```

4. **Start the Backend (from `Projects/backend`):**
   ```bash
   npm run start:dev
   ```
   - Backend will be available at: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api`

5. **Start the Frontend (from `Projects/frontend`):**
   ```bash
   npm run dev
   ```
   - Frontend will be available at: `http://localhost:5173`

---

## 🐳 Docker Setup

### Using Docker Compose (All-in-one)

1. **Start all services:**
   ```bash
   docker compose up -d
   ```

   This starts:
   - PostgreSQL database on port 5432
   - NestJS backend on port 3000
   - React frontend on port 5173

2. **Stop all services:**
   ```bash
   docker compose down
   ```

### Database Connection

**PostgreSQL Credentials:**

| Key      | Value    |
|----------|----------|
| Host     | localhost (or `postgres` in Docker) |
| Port     | 5432     |
| User     | postgres |
| Password | postgres |
| Database | postgres |

---

## 📋 Environment Configuration

### Backend (.env)

Create `Projects/backend/.env`:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=postgres
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
PORT=3000
NODE_ENV=development
```

### Frontend (.env)

Create `Projects/frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
```

---

## 📊 Database Schema

The database includes the following tables:

- **properties** - Real estate properties
- **lands** - Land parcels
- **projects** - Real estate development projects
- **users** - User accounts
- **agent_contacts** - Agent contact requests
- **listings** - Unified listing view

### Seed Data

Run the seed endpoint to populate sample data:
```bash
curl http://localhost:3000/seed
```

---

## 🔌 API Endpoints

### Core Endpoints

**Properties:**
- `GET /properties` - List all properties
- `GET /properties/:id` - Get property details
- `GET /properties/featured` - Get featured properties
- `POST /properties` - Create property
- `PATCH /properties/:id` - Update property
- `DELETE /properties/:id` - Delete property

**Lands:**
- `GET /lands` - List all lands
- `GET /lands/:id` - Get land details
- `GET /lands/popular` - Get popular lands
- `POST /lands` - Create land
- `PATCH /lands/:id` - Update land
- `DELETE /lands/:id` - Delete land

**Projects:**
- `GET /projects` - List all projects
- `GET /projects/:id` - Get project details
- `GET /projects/popular` - Get popular projects
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

**Authentication:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

**Listings:**
- `GET /listings/popular` - Popular listings
- `GET /listings/search?q=...` - Search listings
- `GET /listings/cache/stats` - Cache statistics
- `GET /listings/cache/clear` - Clear cache

**Analytics:**
- `GET /analytics/property/:id/price-history` - Price history
- `GET /analytics/property/:id/local-insights` - Local market insights
- `GET /analytics/market-trends` - Market trends

**Agent Contacts:**
- `POST /agent-contact` - Submit contact request
- `GET /agent-contact/my-requests` - Get contact requests

---

## 🧪 Testing

### Run Backend Tests

```bash
cd Projects/backend

# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

#### Test Coverage Summary

**Overall Coverage:** 43.79% statements | 34.23% branch | 46% functions | 44.51% lines

**Service Layer Coverage (100%):**
- ✅ **AuthService** - 100% statements, 100% branch
  - JWT token generation and validation
  - User registration and login flows
  - Password hashing with bcrypt
  
- ✅ **UsersService** - 100% statements, 100% branch
  - User lookup by ID and email
  - User account creation
  
- ✅ **LandsService** - 100% statements, 100% branch
  - Land CRUD operations
  - Advanced filtering (status, zoning)
  - Popular lands retrieval
  
- ✅ **ProjectsService** - 100% statements, 100% branch
  - Project CRUD operations
  - Advanced filtering
  - Popular projects retrieval
  
- ✅ **ListingsService** - 100% statements, 100% branch
  - Unified search across properties, lands, and projects
  - Redis caching integration
  - Popular listings aggregation
  
- ✅ **CacheService** - 100% statements, 100% branch
  - In-memory caching with TTL
  - Cache invalidation by pattern
  - Cache statistics and hit rate calculation
  
- ✅ **AnalyticsService** - 100% statements, 100% branch
  - Aggregated analytics data retrieval
  - Database statistics calculations

**High Coverage Services:**
- 📊 **PropertiesService** - 85.07% statements, 50% branch
  - Property CRUD operations
  - Advanced search with multiple filters
  - Pagination and sorting
  - Featured properties retrieval
  - 14 comprehensive test cases

**Test Suite Statistics:**
- Total Test Suites: 9 passed
- Total Tests: 86 passed
- Test Files: 
  - `properties.service.spec.ts` - 14 test cases
  - `users.service.spec.ts` - 3 test cases
  - `auth.service.spec.ts` - 3 test cases
  - `lands.service.spec.ts` - 6 test cases
  - `projects.service.spec.ts` - 6 test cases
  - `listings.service.spec.ts` - 2 test cases
  - `agent-contacts.service.spec.ts` - 2 test cases
  - `cache.service.spec.ts` - 5 test cases
  - `analytics.service.spec.ts` - 1 test case

### Run Frontend Linting

```bash
cd Projects/frontend

# Lint
npm run lint
```

---

## 📦 Build for Production

### Backend Build

```bash
cd Projects/backend
npm run build
npm run start:prod
```

### Frontend Build

```bash
cd Projects/frontend
npm run build
npm run preview
```

---

## 🛠️ Available Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the server |
| `npm run start:dev` | Start in development mode with watch |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start in production mode |
| `npm run build` | Build the project |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and fix code |
| `npm run format` | Format code with Prettier |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code |

---

## 🔐 Security

- **JWT Authentication** - Secure API endpoints
- **Password Hashing** - bcrypt for password security
- **CORS** - Configured for frontend domain
- **Input Validation** - Class validators for data integrity
- **Rate Limiting** - Consider implementing for production

---

## 📝 Project Details

- **Author:** shahnawaz2025
- **Email:** gaur.shahnawaz@gmail.com
- **Organization:** Oman Housing Bank
- **Version:** 1.0.0
- **License:** MIT

---

## 📞 Support & Documentation

- **API Documentation:** http://localhost:3000/api (Swagger)
- **Backend README:** `Projects/backend/README.md`
- **Frontend README:** `Projects/frontend/README.md`
- **Database Setup:** `Projects/database/script.sql`

---

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] Payment integration
- [ ] Virtual tours/3D property views
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Advanced reporting

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

**Happy coding! 🎉**
