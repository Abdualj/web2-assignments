# Modular Server Architecture Setup Guide

This guide will help you set up and run the modular server architecture with three separate servers: Authentication Server, Media API Server, and File Upload Server.

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🏗️ Architecture Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│   Auth      │  │   Media     │◄────┐
│   Server    │  │   API       │     │
│   :3001     │  │   :3000     │     │
└──────┬──────┘  └──────┬──────┘     │
       │                │            │
       │                │            │
       ▼                ▼            │
┌─────────────────────────────┐     │
│      MySQL Database         │     │
│      hybrid_media_db        │     │
└─────────────────────────────┘     │
                                    │
┌─────────────┐                     │
│   Upload    │─────────────────────┘
│   Server    │
│   :3002     │
└─────────────┘
```

## 🗄️ Database Setup

### Step 1: Create MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE hybrid_media_db;
USE hybrid_media_db;

# Exit MySQL
exit;
```

### Step 2: Import Database Schema

```bash
# Import the database schema
mysql -u root -p hybrid_media_db < database.sql
```

The database includes:
- **UserLevels**: User permission levels (Admin, User, Guest)
- **Users**: User accounts with authentication
- **MediaItems**: Uploaded media files metadata
- **Tags**: Tags for categorizing media
- **MediaItemTags**: Many-to-many relationship for media and tags
- **Comments**: Comments on media items
- **MediaItemRatings**: User ratings for media items

### Default Test Users

| Username | Email | Password | Level |
|----------|-------|----------|-------|
| admin | admin@example.com | password | Admin |
| testuser | testuser@example.com | password | User |
| johndoe | john.doe@example.com | password | User |

## 🔧 Environment Configuration

### Step 3: Update .env Files

All three servers already have `.env` files created. Update the database credentials:

#### 1. Authentication Server (.env)
```bash
cd hybrid-auth-server
# Edit the .env file and update:
DB_USER=root
DB_PASS=your_mysql_password
```

#### 2. Media API Server (.env)
```bash
cd ../hybrid-media-api
# Edit the .env file and update:
DB_USER=root
DB_PASS=your_mysql_password
```

#### 3. Upload Server (.env)
```bash
cd ../hybrid-upload-server
# No database configuration needed - already configured
```

**Important**: All three servers share the same `JWT_SECRET`. This is required for JWT token validation across servers.

## 📦 Installation

### Step 4: Install Dependencies

Install dependencies for all three servers:

```bash
# From the modular-servers directory
cd hybrid-auth-server
npm install

cd ../hybrid-media-api
npm install

cd ../hybrid-upload-server
npm install

cd ..
```

### Step 5: Generate API Documentation

Generate API documentation for each server:

```bash
cd hybrid-auth-server
npm run apidoc

cd ../hybrid-media-api
npm run apidoc

cd ../hybrid-upload-server
npm run apidoc

cd ..
```

## 🚀 Running the Servers

### Option 1: Run Each Server Separately

Open three terminal windows:

**Terminal 1 - Auth Server:**
```bash
cd modular-servers/hybrid-auth-server
npm run dev
```

**Terminal 2 - Media API Server:**
```bash
cd modular-servers/hybrid-media-api
npm run dev
```

**Terminal 3 - Upload Server:**
```bash
cd modular-servers/hybrid-upload-server
npm run dev
```

### Option 2: Run All Servers with Concurrently

Create a root `package.json` for running all servers:

```bash
# From the modular-servers directory
npm init -y
npm install --save-dev concurrently
```

Add this script to `modular-servers/package.json`:

```json
{
  "scripts": {
    "dev": "concurrently --kill-others \"cd hybrid-auth-server && npm run dev\" \"cd hybrid-media-api && npm run dev\" \"cd hybrid-upload-server && npm run dev\"",
    "dev:auth": "cd hybrid-auth-server && npm run dev",
    "dev:media": "cd hybrid-media-api && npm run dev",
    "dev:upload": "cd hybrid-upload-server && npm run dev"
  }
}
```

Then run all servers:

```bash
cd modular-servers
npm run dev
```

## 🧪 Testing the Setup

### 1. Check Server Status

Visit these URLs to verify servers are running:

- **Auth Server**: http://localhost:3001/ (API Documentation)
- **Media API**: http://localhost:3000/ (API Documentation)
- **Upload Server**: http://localhost:3002/ (API Documentation)

### 2. Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "password123",
    "email": "newuser@example.com"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password"
  }'

# Save the returned token for next requests
```

### 3. Test Media API

```bash
# Get all media (requires authentication)
curl http://localhost:3000/api/v1/media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get media by user
curl http://localhost:3000/api/v1/media/user/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Test File Upload

```bash
# Upload a file (requires authentication)
curl -X POST http://localhost:3002/api/v1/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"

# The response will include file details that need to be posted to Media API
```

## 📚 API Endpoints

### Authentication Server (Port 3001)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/auth/login | Login user | No |
| POST | /api/v1/users | Register new user | No |
| GET | /api/v1/users | Get all users | Yes (Admin) |
| GET | /api/v1/users/:id | Get user by ID | Yes |
| PUT | /api/v1/users/:id | Update user | Yes (Own) |
| DELETE | /api/v1/users/:id | Delete user | Yes (Own/Admin) |

### Media API Server (Port 3000)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/media | Get all media | Yes |
| GET | /api/v1/media/:id | Get media by ID | Yes |
| GET | /api/v1/media/user/:id | Get media by user | Yes |
| POST | /api/v1/media | Create media item | Yes |
| PUT | /api/v1/media/:id | Update media | Yes (Owner) |
| DELETE | /api/v1/media/:id | Delete media | Yes (Owner) |
| POST | /api/v1/comments | Add comment | Yes |
| GET | /api/v1/comments/media/:id | Get comments | Yes |
| POST | /api/v1/ratings | Rate media | Yes |
| GET | /api/v1/ratings/media/:id | Get ratings | Yes |
| GET | /api/v1/tags | Get all tags | Yes |
| POST | /api/v1/tags | Create tag | Yes |

### Upload Server (Port 3002)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/v1/upload | Upload file | Yes |
| DELETE | /api/v1/upload/:filename | Delete file | Yes (Owner) |
| GET | /uploads/:filename | Get uploaded file | No |

## 🔐 Security Features

1. **JWT Authentication**: All servers use shared JWT secret for token validation
2. **Password Hashing**: bcrypt with salt rounds
3. **CORS**: Configured for cross-origin requests
4. **Input Validation**: Validated on all endpoints
5. **File Type Validation**: Only allowed file types can be uploaded
6. **Authorization**: Role-based and ownership-based access control

## 🛠️ Development Tips

### Debugging

Enable detailed logging by setting in `.env`:
```
NODE_ENV=development
```

### Database Inspection

```bash
# View users
mysql -u root -p -e "SELECT * FROM Users;" hybrid_media_db

# View media items
mysql -u root -p -e "SELECT * FROM MediaItems;" hybrid_media_db

# View all tables
mysql -u root -p -e "SHOW TABLES;" hybrid_media_db
```

### Reset Database

```bash
mysql -u root -p hybrid_media_db < database.sql
```

## 📝 Common Issues

### Issue: "Access denied for user"
**Solution**: Check your MySQL credentials in `.env` files

### Issue: "Port already in use"
**Solution**: Change PORT in `.env` file or kill the process using the port

### Issue: "JWT token invalid"
**Solution**: Ensure all servers use the same JWT_SECRET

### Issue: "Cannot connect to database"
**Solution**: 
- Verify MySQL is running: `mysql.server status` (macOS)
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env`

## 🎯 Next Steps

1. **Review the Code**: Explore the model, controller, and route files
2. **Test Endpoints**: Use Postman or curl to test all endpoints
3. **Implement Features**: Start building your individual project features
4. **Update Types**: Modify `hybrid-types` for your custom data structures
5. **Add Endpoints**: Create new endpoints based on your project requirements

## 📖 Additional Resources

- API Documentation: Available at each server's root URL
- TypeScript Types: See `hybrid-types/src/DBTypes.ts`
- Example Tests: Check `test/` directories in each server

---

**Status**: ✅ All servers configured and ready to run
**Database**: ✅ Schema created with sample data
**Authentication**: ✅ JWT-based with shared secret
**Next**: Start implementing your individual project features!
