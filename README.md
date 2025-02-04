# URL Shortener 🔗

A URL shortening service built with Node.js, Express, MongoDB. Containerized with Docker for easy deployment.

[![Node.js](https://img.shields.io/badge/Node.js-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-blue)](https://www.docker.com/)

## Features ✨

- URL shortening with 7-character using Twitter Snowflake ID 
- Redirect to original URLs with click tracking
- Get statistics for shortened URLs
- Rate limiting (100 requests/hour)
- Input validation with Zod
- Docker support for development and production
- Swagger API documentation
- Health check endpoint

## Prerequisites 📋

- Node.js v18+
- Docker
- MongoDB Atlas account or local MongoDB instance

## Installation 🛠️

1. Clone the repository:
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```
2. Install dependencies:
```bash
npm install
```
3. Create environment file:
```bash
cp .env.example .env
```
```env
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.example.mongodb.net/?retryWrites=true&w=majority&appName=<appName>
DB_NAME=urls
```

## Running the application 🚀

```bash
npm run dev
```

### API Documentation 📚

Swagger UI is available only in development mode:

```
http://localhost:3000/api-docs
```

