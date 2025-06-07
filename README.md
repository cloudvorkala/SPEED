# SPEED - Software Practice Empirical Evidence Database

Test account and password for admin is "admin@example.com" and  "admin123"
User needs to register first, then Admin can make him a moderator or analyst in user management.
New articles need to be approved by moderator then can be analyse by a analyst user.
I have two user ready for testing, test3@test.com as moderator, test4@test.com as analyst, their passwd are both "test1234"
but be free to test by create your own one!

SPEED is a platform for storing and retrieving evidence related to software engineering practices. The system allows users to submit, review, analyze, and search for research evidence on the effectiveness of software engineering practices.

## Project Structure

The project consists of two parts:

- **Frontend**: A web application built with Next.js
- **Backend**: An API service built with Nest.js and MongoDB

### Frontend Structure

```
frontend/
  ├── src/
  │   ├── app/            # App Router pages
  │   ├── components/     # Reusable components
  │   ├── contexts/       # Context providers
  │   └── types/          # TypeScript type definitions
  ├── public/             # Static assets
  └── package.json        # Dependency configuration
```

### Backend Structure

```
backend/
  ├── src/
  │   ├── models/         # MongoDB data models
  │   ├── modules/        # Feature modules
  │   │   ├── articles/   # Article module
  │   │   ├── practices/  # Practice module
  │   │   ├── claims/     # Claim module
  │   │   └── evidence/   # Evidence module
  │   ├── users/          # User module
  │   ├── auth/           # Authentication module
  │   ├── database/       # Database configuration
  │   ├── app.module.ts   # Main application module
  │   ├── app.service.ts  # Main application service
  │   ├── app.controller.ts # Main application controller
  │   └── main.ts         # Application entry point
  ├── test/               # Test files
  └── package.json        # Dependency configuration
```

## Data Models

The system includes the following main data models:

1. **Article**: Represents published research articles
2. **Practice**: Software engineering practices (e.g., TDD, Pair Programming)
3. **Claim**: Claims about software engineering practices (e.g., "improves code quality")
4. **Evidence**: Evidence linking articles and claims, including results (agree, disagree, neutral)
5. **User**: System user information and roles
6. **Rating**: User ratings for articles
7. **SavedQuery**: User-saved search queries

## Features

- User registration and authentication
- Submit literature references
- Review submitted literature
- Analyze literature and extract evidence
- Search evidence by practice, claim, and year
- Save common queries
- Rate articles
- Visualize search results

## Development Environment Setup

### Prerequisites

- Node.js (v16+)
- MongoDB (v4+)

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The service will run at http://localhost:4000.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application will run at http://localhost:4001.

## API Interface

Detailed API documentation can be accessed at the /api path of the running backend service.

## Contributing

Issues and merge requests are welcome!

## License

[MIT](LICENSE)