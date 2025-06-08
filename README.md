Movie Watchlist App

A full-stack Movie Watchlist application that allows users to search movies from the OMDb API, add them to a personal watchlist, mark them as watched, leave notes and ratings, and remove them. Built with:

* *Backend*: Node.js, Express, PostgreSQL
* *Frontend*: React, TypeScript, Tailwind CSS, Vite
* *Authentication*: JWT
* *APIs*: OMDb API for movie data

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Available Scripts](#available-scripts)

---

## Prerequisites

Make sure you have the following installed:

* [Node.js (v16+)](https://nodejs.org/) and npm (or yarn)
* [PostgreSQL](https://www.postgresql.org/) (v12+)
* A free [OMDb API key](http://www.omdbapi.com/apikey.aspx)

---

## Environment Variables

Create a .env file in each of the backend/ and frontend/ directories. Copy from the provided .env in each folder and fill in your own values:
PORT=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

### Backend (backend/.env)

# PostgreSQL connection string
dATABASE_URL= use Supabase

# JWT secret for signing auth tokens
JWT_SECRET=your_jwt_secret

# Port for Express server
PORT=5000

# Get OMDb API key
[http://www.omdbapi.com/?apikey=](http://www.omdbapi.com/?apikey=${OMDB_KEY})
Register and receive your key in emails
Call it in backend

### Frontend (frontend/.env)

text
# Base URL of your backend API
VITE_API_URL=http://localhost:5000/api

---

## Database Setup

1. Create your database:

   bash
   createdb your_db
   

2. Enable the UUID extension and create the watchlist table:

   sql
   -- connect to your_db in psql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   CREATE TABLE IF NOT EXISTS public.watchlist (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
     imdb_id text NOT NULL,
     title text NOT NULL,
     year text,
     poster text,
     watched boolean NOT NULL DEFAULT false,
     note text DEFAULT '',
     rating int CHECK (rating BETWEEN 0 AND 10) DEFAULT 0,
     created_at timestamptz NOT NULL DEFAULT now(),
     UNIQUE (user_id, imdb_id)
   );

---

## Backend Setup

1. Navigate into the backend/ directory:

   bash
   cd backend
   

2. Install dependencies:

   bash
   npm install
   

3. Build or start in development mode:

   bash
   # development with auto‑reload
   npm run dev

   # or production build + start
   npm run build
   npm start
   

The server will listen on http://localhost:5000 by default.

---

## Frontend Setup

1. Navigate into the frontend/ directory:

   bash
   cd frontend
   

2. Install dependencies:

   bash
   npm install
   

3. Start the development server:

   bash
   npm run dev
   

By default, Vite will serve your app at http://localhost:5173 (or another port if 5173 is occupied).

---

## Running the Application

1. Make sure your *PostgreSQL* server is running and the watchlist table is created.
2. Start the *backend*:

   bash
   cd backend
   npm run dev
   
3. Start the *frontend*:

   bash
   cd frontend
   npm run dev
   
4. Open your browser to [http://localhost:5173](http://localhost:5173).

Now you can register/login, browse movies, add them to your watchlist, and manage your personal entries.

---

## Available Scripts

### Backend

* npm run dev — Start server in development (with nodemon).
* npm run build — Compile TypeScript (if used) to JavaScript.
* npm start — Run the compiled build in production mode.

### Frontend

* npm run dev — Launch Vite dev server.
* npm run build — Create a production build.
* npm run preview — Preview the production build locally.
