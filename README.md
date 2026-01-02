# Job Search App

A full-stack job aggregator application that scrapes job listings from multiple sources and presents them in a modern, searchable interface.

## 🎯 Project Overview

This application aggregates job listings from various job boards (starting with HelloWorld.rs) and provides a unified search experience. Users can filter jobs by field (e.g., Software Engineering, Project Management) and seniority level (Junior, Medior, Senior).

### Key Features

- **Job Aggregation**: Scrapes job listings from multiple sources using Puppeteer
- **Smart Filtering**: Filter by professional field and seniority level
- **Caching**: Built-in caching to reduce load on source websites
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Search**: Instant search results with loading states

## 🏗️ Architecture

```
job-search-app/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── jobs/     # Jobs module (controller, service, DTOs)
│   │   └── shared/
│   │       ├── automation/    # Puppeteer browser automation
│   │       ├── scraping/      # Job extraction utilities
│   │       ├── sites/         # Site-specific scrapers
│   │       └── utils/         # Caching and utilities
│   └── test/
└── frontend/         # TanStack Start (React) application
    ├── src/
    │   ├── api/           # API client functions
    │   ├── components/    # React components
    │   │   └── ui/        # shadcn/ui components
    │   ├── lib/           # Utility functions
    │   ├── routes/        # File-based routing
    │   └── types/         # TypeScript interfaces
    └── public/
```

## 🛠️ Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Web Scraping**: [Puppeteer](https://pptr.dev/) - Headless browser automation
- **Caching**: NestJS Cache Manager
- **Validation**: class-validator & class-transformer
- **Language**: TypeScript

### Frontend

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **Routing**: [TanStack Router](https://tanstack.com/router) - Type-safe routing
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Chrome/Chromium (for Puppeteer)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd job-search-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend** (Terminal 1)

   ```bash
   cd backend
   npm run start:dev
   ```

   The API will be available at `http://localhost:3000`

2. **Start the frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run start:dev
   ```
   The app will be available at `http://localhost:4200`

## 📡 API Endpoints

| Method | Endpoint                               | Description                  |
| ------ | -------------------------------------- | ---------------------------- |
| GET    | `/api/jobs`                            | Get all job listings         |
| GET    | `/api/jobs?field=software-engineering` | Filter by field              |
| GET    | `/api/jobs?seniority=senior`           | Filter by seniority          |
| GET    | `/api/jobs/filters`                    | Get available filter options |

### Available Filters

**Fields:**

- `software-engineering` - Software Engineering / Programming
- `project-management` - Project Management

**Seniority Levels:**

- `junior` - Junior
- `medior` - Mid-Level
- `senior` - Senior

## 🔧 Configuration

### Backend

The backend runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

CORS is configured to allow requests from:

- `http://localhost:4200` (frontend dev server)
- `http://localhost:3000`

### Frontend

Create a `.env` file in the frontend directory to override the API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing

### Backend

```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Frontend

```bash
cd frontend
npm run test
```

## 📁 Project Structure Details

### Backend Modules

- **JobsModule**: Main module handling job listing endpoints
- **HelloworldModule**: Scraper for HelloWorld.rs job board
- **AutomationModule**: Puppeteer service for browser automation
- **CacheModule**: In-memory caching for scraped data

### Frontend Pages

- **Home (`/`)**: Marketing landing page with search
- **Jobs (`/jobs`)**: Browse and filter job listings
- **404**: Custom not found page

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Improvements

- [ ] Add more job board scrapers
- [ ] Implement user authentication
- [ ] Add job bookmarking/favorites
- [ ] Email notifications for new jobs
- [ ] Advanced search with keywords
- [ ] Job detail pages
- [ ] Company profiles

## 📄 License

This project is private and unlicensed.

---

Built with ❤️ using NestJS and TanStack Start
