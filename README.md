# Film Rental Backend API

This is a RESTful API built with Hapi.js, TypeScript, and Prisma for managing a film rental system.

## Features

- Films Module
  - List films with filtering and sorting
  - Filter by category, language, release year, length, and actor
  - Save and manage filter/sort views
  - View film details and actors

- Stores Module
  - List stores with staff and rental counts
  - Sort by various fields including computed fields
  - Filter by city, zip code, and staff count
  - View store details, staff, and rentals

- Rental Module
  - List rentals with movie, customer, store details
  - Filter by date range, store, customer, and movie
  - View detailed rental information

## Prerequisites

- Node.js >= 18.18
- MySQL database with Sakila sample database

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   HOST=localhost
   DATABASE_URL="mysql://user:password@localhost:3306/sakila"
   ```
   Replace the database connection string with your actual MySQL credentials.

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

Once the server is running, you can access the Swagger documentation at:
```
http://localhost:3000/documentation
```

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm run build`: Build TypeScript code

## API Endpoints

### Films
- GET /api/films - List films with filtering and sorting
- GET /api/films/{id} - Get film details
- POST /api/films/views - Save a filter/sort view
- GET /api/films/views - List saved views
- GET /api/films/views/{id} - Get view details

### Stores
- GET /api/stores - List stores
- GET /api/stores/{id} - Get store details
- GET /api/stores/{id}/staff - Get store staff
- GET /api/stores/{id}/rentals - Get store rentals

### Rentals
- GET /api/rentals - List rentals
- GET /api/rentals/{id} - Get rental details 