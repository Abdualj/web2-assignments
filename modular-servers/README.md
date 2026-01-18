Modular Server Architecture (Auth + Media + Upload)
A small microservices-style backend with three separate servers:
Auth Server (JWT, users) – :3001
Media API (posts, comments, ratings, tags) – :3000
Upload Server (files, images, videos) – :3002
All built with TypeScript, Express, and MySQL, sharing the same database and JWT secret.

What it does
User auth with JWT
Media CRUD (with comments, ratings, tags)
File upload & serving
Role-based access (Admin / User / Guest)
Each service runs and scales independently
Run it
npm run install:all
npm run dev
Servers:
Auth → http://localhost:3001
Media → http://localhost:3000
Upload → http://localhost:3002

Basic Flow
Login on Auth server → get JWT
Use JWT to call Media API
Use same JWT to upload files

Main Services
Auth Server
Register / Login
JWT tokens
User roles

Media API
Media CRUD
Comments
Ratings (1–5)
Tags

Upload Server
Image / video upload
Validation
File serving

Tech
Express + TypeScript
MySQL
JWT + bcrypt
apiDoc
Modular / microservice-style setup