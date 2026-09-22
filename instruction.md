# instruction.md

## Project Title
**StreamLite - Simple Microservice-Based Streaming Platform**

## Main Goal
Build a **simple and working streaming platform prototype** using **microservice architecture**.

The system should look like a very small and student-level version of Netflix or Amazon Prime, but it must **not be complex**. Keep the design, code structure, and features simple, clean, and easy to understand.

This project is for a university assignment, so the focus is on:
- correct microservice architecture
- clear separation of services
- working API communication between services
- basic security
- clean UI
- Docker support
- easy local setup
- simple cloud-ready structure

Do **not** build a production-level platform. Do **not** add advanced features.

---

# 1. Overall System Requirement

Create a full-stack application with:
- **Frontend**: React-based web application
- **Backend**: 4 separate microservices
- **Communication**: REST APIs between services
- **Databases**: one database/collection scope per service
- **Authentication**: JWT-based authentication
- **Containerization**: Docker support for all services

The application must be simple, functional, and easy for 4 students to manage.

---

# 2. Finalized Microservices

The system must contain exactly these **4 backend microservices**:

1. **User Service**
2. **Catalog Service**
3. **Watchlist Service**
4. **Playback / History Service**

These are the finalized services and must all be included.

Do not replace them with other services.

---

# 3. Application Scope

The application should support only these core features:

## User features
- user registration
- user login
- view user profile
- browse all movies
- view single movie details
- search movies by title or genre
- add movie to watchlist
- remove movie from watchlist
- view personal watchlist
- start playback for a movie
- save simple viewing history
- show continue watching list

## Admin-like content feature
A simple way to add movies to the catalog is enough. This can be:
- a simple backend API for adding movies
- or a very small admin form in frontend

Keep this very basic.

---

# 4. Features That Must NOT Be Added

To keep the project simple, do **not** include:
- payment gateway
- subscriptions
- AI recommendation engine
- reviews and ratings
- comments system
- live streaming
- multiple user roles with complex permissions
- DRM
- real video hosting logic
- notification system
- email verification
- social login
- chat
- analytics dashboard
- advanced admin panel
- message broker or event streaming tools
- Kubernetes unless absolutely needed

Use simple REST communication only.

---

# 5. Recommended Tech Stack

Use a **simple, consistent stack** across the whole system.

## Frontend
- React
- React Router
- Axios
- Basic CSS or simple component styling

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication and security
- JWT
- bcrypt
- express-validator or a simple validation approach
- CORS
- dotenv

## API documentation
- Swagger / OpenAPI

## Testing
- Postman for manual API testing
- Optional: Jest + Supertest for a few simple tests

## DevOps
- Docker
- Docker Compose for local development
- GitHub
- GitHub Actions for CI/CD

---

# 6. High-Level Architecture

Build the system using this architecture:

## Frontend
A single React web application for users.

## Backend microservices
- User Service
- Catalog Service
- Watchlist Service
- Playback / History Service

## Databases
Use MongoDB. Each service should manage its own data separately.
This can be done by:
- separate databases
- or separate collections per service

## Communication
- Frontend calls backend APIs
- Backend services communicate with each other using REST APIs
- Keep the communication simple and direct

## Optional Gateway
An API Gateway is optional.
If adding an API Gateway makes the system more complex, do **not** add one.
For this student project, the frontend can call each service directly.

---

# 7. Important Architectural Rule

All four services must be part of one connected application.

Every service must communicate with at least one other service.

The services do **not** need to all directly call every other service, but none of them should be isolated.

The final system must clearly show inter-service communication.

---

# 8. Service-by-Service Requirements

## 8.1 User Service

### Purpose
Handle user registration, login, user profile, and user validation.

### Responsibilities
- register a new user
- login user
- hash passwords using bcrypt
- generate JWT token
- return current user profile
- return a user by id
- validate that a given user exists

### Core data fields
- userId
- name
- email
- passwordHash
- role
- createdAt

### Required endpoints
- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users/profile`
- `GET /api/users/:id`
- `GET /api/users/validate/:id`

### Notes
- keep role handling very simple
- a normal default role like `user` is enough
- protect profile endpoint with JWT
- store password as hashed password only

---

## 8.2 Catalog Service

### Purpose
Handle movie/show metadata.

### Responsibilities
- add a movie
- list all movies
- get movie by id
- search movies
- return stream info for a movie

### Core data fields
- movieId
- title
- description
- genre
- thumbnailUrl
- trailerUrl
- videoUrl
- duration
- isAvailable
- createdAt

### Required endpoints
- `POST /api/catalog`
- `GET /api/catalog`
- `GET /api/catalog/:movieId`
- `GET /api/catalog/search?q=`
- `GET /api/catalog/:movieId/stream-info`

### Notes
- use very simple movie data
- videoUrl can be a sample hosted mp4 link or demo video path
- trailerUrl can be a YouTube link
- keep search simple

---

## 8.3 Watchlist Service

### Purpose
Store the movies saved by each user.

### Responsibilities
- add movie to watchlist
- remove movie from watchlist
- get all watchlist items for a user
- check if a movie is already in the watchlist
- optionally update watchlist item status

### Core data fields
- watchlistId
- userId
- movieId
- addedAt
- status

### Required endpoints
- `POST /api/watchlist`
- `DELETE /api/watchlist/:userId/:movieId`
- `GET /api/watchlist/:userId`
- `GET /api/watchlist/:userId/check/:movieId`
- `POST /api/watchlist/status`

### Notes
- before saving a watchlist item, validate user and movie
- avoid duplicates
- watchlist item status can be something simple like `saved` or `watched`

---

## 8.4 Playback / History Service

### Purpose
Handle movie playback response and viewing history.

### Responsibilities
- start playback for a selected movie
- return the video/trailer info needed for playing
- save viewing history
- update watch progress
- return continue watching list
- mark a movie as completed

### Core data fields
- historyId
- userId
- movieId
- watchedAt
- progress
- status

### Required endpoints
- `POST /api/playback/start`
- `POST /api/playback/history`
- `GET /api/playback/history/:userId`
- `GET /api/playback/continue/:userId`
- `POST /api/playback/complete`

### Notes
- playback is simple and does not require real media streaming server logic
- just return video URL and movie details from Catalog Service
- keep progress simple, such as a percentage or watched seconds

---

# 9. Required Interactions Between Services

The following service interactions must be implemented clearly.

## 9.1 User Service ↔ Watchlist Service
### Why
Watchlist must know which user is saving the movie.

### Data shared
- userId
- token or validation response

### Expected behavior
When a user adds a movie to watchlist:
1. frontend sends request to Watchlist Service
2. Watchlist Service gets userId from token or request
3. Watchlist Service validates the user using User Service
4. if user exists, process continues

---

## 9.2 User Service ↔ Playback / History Service
### Why
Playback and history should be linked to a valid user.

### Data shared
- userId
- token or validation response

### Expected behavior
When a user starts playback:
1. Playback Service receives the request
2. Playback Service validates the user through User Service
3. if user is valid, playback response and history logging continue

---

## 9.3 Catalog Service ↔ Watchlist Service
### Why
Watchlist should not store movies that do not exist.

### Data shared
- movieId
- title
- availability

### Expected behavior
When adding to watchlist:
1. Watchlist Service receives movieId
2. Watchlist Service calls Catalog Service
3. Catalog Service confirms the movie exists
4. Watchlist item is stored only if valid

---

## 9.4 Catalog Service ↔ Playback / History Service
### Why
Playback needs movie metadata and stream information.

### Data shared
- movieId
- title
- trailerUrl
- videoUrl
- duration

### Expected behavior
When playback starts:
1. Playback Service receives movieId
2. Playback Service calls Catalog Service
3. Catalog Service returns stream info
4. Playback Service returns the data to frontend and logs history

---

## 9.5 Watchlist Service ↔ Playback / History Service
### Why
This makes the system more connected and stronger for demo.

### Data shared
- userId
- movieId
- watched status
- progress status

### Expected behavior
When a user plays a movie from watchlist:
1. user selects a movie from saved watchlist
2. Playback Service starts playback
3. once completed, Playback Service may notify Watchlist Service
4. Watchlist Service may mark the item as watched or update status

This interaction can be simple.

---

# 10. Main End-to-End User Flow

Implement this simple flow:

## Flow 1 - Register and login
1. user registers using User Service
2. user logs in using User Service
3. frontend stores token

## Flow 2 - Browse movies
1. frontend gets all movies from Catalog Service
2. user opens a single movie details page

## Flow 3 - Add to watchlist
1. user clicks Add to Watchlist
2. frontend sends request to Watchlist Service
3. Watchlist Service validates user using User Service
4. Watchlist Service validates movie using Catalog Service
5. movie is added to watchlist

## Flow 4 - Play a movie
1. user clicks Play
2. frontend sends request to Playback Service
3. Playback Service validates user using User Service
4. Playback Service fetches stream info from Catalog Service
5. Playback Service stores history
6. Playback Service may update Watchlist Service status

## Flow 5 - Continue watching
1. frontend gets continue watching list from Playback Service
2. Playback Service returns recent history records

---

# 11. Frontend Requirements

Build a **simple, clean, student-level frontend** in React.

Do not over-design it.

## Required pages
- Home page
- Login page
- Register page
- Movie listing page
- Movie details page
- Watchlist page
- History / Continue Watching page
- Simple player page

## UI style guidance
- modern but simple
- clean card-based layout for movies
- responsive enough for desktop and mobile
- no complex animations
- use simple navigation bar
- use consistent colors and spacing
- simple buttons and forms

## Required UI actions
- register
- login
- logout
- browse movie list
- search movies
- open movie details
- add to watchlist
- remove from watchlist
- play movie
- view continue watching/history

---

# 12. Backend Folder Structure Suggestion

Use a simple structure for each microservice.

```text
service-name/
  src/
    config/
    controllers/
    models/
    routes/
    middleware/
    services/
    utils/
    app.js
    server.js
  tests/
  Dockerfile
  .dockerignore
  .env.example
  package.json
  README.md
```

Use this same structure for all four services as much as possible.

---

# 13. Frontend Folder Structure Suggestion

```text
frontend/
  src/
    api/
    components/
    pages/
    context/
    hooks/
    utils/
    App.jsx
    main.jsx
  public/
  Dockerfile
  .dockerignore
  package.json
  README.md
```

---

# 14. Database Design Guidance

Keep the database design simple.

## User collection
- name
- email
- passwordHash
- role
- createdAt

## Catalog collection
- title
- description
- genre
- thumbnailUrl
- trailerUrl
- videoUrl
- duration
- isAvailable
- createdAt

## Watchlist collection
- userId
- movieId
- addedAt
- status

## History collection
- userId
- movieId
- watchedAt
- progress
- status

No complex relational modeling is required.

---

# 15. Authentication Rules

Use JWT-based authentication.

## Requirements
- login returns JWT token
- protected routes must verify JWT token
- token must be sent in authorization header
- password must be hashed with bcrypt

## Protected routes example
- user profile
- add to watchlist
- remove from watchlist
- playback start
- history endpoints

---

# 16. Validation Rules

Add basic validation for all important inputs.

## Examples
- name should not be empty
- email must be valid
- password minimum length should be reasonable
- title should not be empty
- genre should not be empty
- movieId and userId should be checked before saving

Return clean error messages.

---

# 17. Error Handling Rules

Implement consistent error handling in all services.

## Requirements
- use proper HTTP status codes
- return JSON error responses
- handle not found cases
- handle duplicate watchlist items
- handle invalid credentials
- handle invalid token
- handle movie not found
- handle user not found

Keep the error format simple and consistent.

Example:
```json
{
  "message": "Movie not found"
}
```

---

# 18. Swagger / API Documentation Requirement

Each microservice should include Swagger/OpenAPI documentation.

At minimum, document:
- all endpoints
- request body
- parameters
- success response
- error response

Keep the docs simple but clear.

---

# 19. Docker Requirement

Every backend service and the frontend should have Docker support.

## Each service must include
- `Dockerfile`
- `.dockerignore`
- environment variable support

## Suggested local ports
- frontend: `3000`
- user service: `5001`
- catalog service: `5002`
- watchlist service: `5003`
- playback/history service: `5004`

Use Docker Compose for local development if possible.

---

# 20. Docker Compose Requirement

Create a simple `docker-compose.yml` that can run:
- frontend
- user service
- catalog service
- watchlist service
- playback/history service
- mongodb

Keep the compose file simple and readable.

---

# 21. CI/CD Guidance

Prepare the codebase so each service can be used with GitHub Actions.

A basic pipeline is enough:
- install dependencies
- run lint
- run tests if available
- build Docker image

Do not make CI/CD overly complex.

---

# 22. Security Requirements

Apply only simple and realistic security measures.

## Must include
- bcrypt password hashing
- JWT authentication
- basic route protection
- input validation
- CORS configuration
- environment variables for secrets

## Good to include
- rate limiting on login endpoint
- helmet middleware
- avoiding hard-coded secrets

---

# 23. Environment Variables

Use environment variables in all services.

## Example variables
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `USER_SERVICE_URL`
- `CATALOG_SERVICE_URL`
- `WATCHLIST_SERVICE_URL`
- `PLAYBACK_SERVICE_URL`

Provide `.env.example` files.

---

# 24. Seed Data Requirement

Provide simple seed data for catalog.

At least 6 to 10 sample movies should be available.

Each movie should contain:
- title
- description
- genre
- thumbnailUrl
- trailerUrl
- videoUrl
- duration

Use public demo links or placeholder links if needed.

---

# 25. Code Style Guidance

Code should be:
- simple
- readable
- modular
- beginner-friendly
- well-structured

Avoid overengineering.

Do not use highly complex design patterns unless necessary.

---

# 26. Development Priority Order

Build in this order:

## Phase 1
- setup repositories or folders
- create basic service structure
- configure MongoDB connection
- create frontend base pages

## Phase 2
- complete User Service
- complete Catalog Service

## Phase 3
- complete Watchlist Service
- add service-to-service validation

## Phase 4
- complete Playback / History Service
- connect playback with catalog and user validation

## Phase 5
- connect frontend to all services
- test end-to-end flow

## Phase 6
- add Swagger
- add Docker
- add docker-compose
- improve validation and error handling

---

# 27. Required Deliverable Quality

The generated system should be:
- fully aligned with simple microservice architecture
- easy for 4 students to understand and modify
- not overloaded with features
- working properly end-to-end
- ready for local demo
- ready to be containerized

---

# 28. Important Constraints for the Generator

When generating the code, follow these rules carefully:

1. Keep the project **simple**.
2. Do **not** make the UI overly fancy.
3. Do **not** add extra services beyond the finalized 4 services.
4. Do **not** introduce complex event-driven architecture.
5. Do **not** use TypeScript unless explicitly needed.
6. Do **not** use advanced state management unless needed.
7. Do **not** create a large enterprise architecture.
8. Prioritize clear code and working APIs over complexity.
9. Make sure all services are actually connected.
10. The application should be realistic for a university group assignment.

---

# 29. Final Expected Outcome

Generate a complete simple microservice-based streaming platform called **StreamLite** with:
- React frontend
- 4 backend microservices
- MongoDB persistence
- JWT authentication
- watchlist and history features
- simple inter-service REST communication
- Docker support
- Swagger docs
- clean and beginner-friendly code structure

The final result must feel like a **small but complete student project**, not a production streaming system.

---

# 30. Final Instruction to the Generator

Build the application exactly according to the above requirements.

Focus on:
- simplicity
- correctness
- microservice separation
- working inter-service communication
- clear folder structure
- easy local setup
- basic UI
- basic security

Do not overcomplicate anything.
