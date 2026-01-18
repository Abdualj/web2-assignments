-- Modular Server Architecture Database Schema
-- This database is shared by all servers (Auth, Media API, Upload)

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS MediaItemRatings;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS MediaItemTags;
DROP TABLE IF EXISTS MediaItems;
DROP TABLE IF EXISTS TagCategories;
DROP TABLE IF EXISTS Tags;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS UserLevels;

-- User Levels Table
CREATE TABLE UserLevels (
  level_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  level_name VARCHAR(50) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL DEFAULT 2,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

-- Media Items Table  
CREATE TABLE MediaItems (
  media_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Tags Table
CREATE TABLE Tags (
  tag_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  tag_name VARCHAR(255) NOT NULL UNIQUE
);

-- Media Item Tags (Many-to-Many relationship)
CREATE TABLE MediaItemTags (
  media_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (media_id, tag_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES Tags(tag_id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE Comments (
  comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Media Item Ratings Table
CREATE TABLE MediaItemRatings (
  rating_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  rating_value INT NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_media_rating (media_id, user_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Insert initial user levels
INSERT INTO UserLevels (level_name) VALUES ('Admin');
INSERT INTO UserLevels (level_name) VALUES ('User');
INSERT INTO UserLevels (level_name) VALUES ('Guest');

-- Insert test users (password is 'password' hashed with bcrypt)
-- Hash generated with: bcrypt.hash('password', 10)
-- You should change these passwords in production!
INSERT INTO Users (username, password, email, user_level_id) VALUES 
('admin', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', 'admin@example.com', 1),
('testuser', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', 'testuser@example.com', 2),
('johndoe', '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u', 'john.doe@example.com', 2);

-- Insert some sample tags
INSERT INTO Tags (tag_name) VALUES 
('nature'),
('technology'),
('travel'),
('food'),
('art'),
('music');

-- Insert sample media items
INSERT INTO MediaItems (user_id, filename, filesize, media_type, title, description) VALUES
(2, 'sample1.jpg', 102400, 'image/jpeg', 'Beautiful Sunset', 'A stunning sunset over the ocean'),
(2, 'sample2.jpg', 204800, 'image/jpeg', 'Mountain View', 'Majestic mountains in the morning'),
(3, 'sample3.mp4', 1048576, 'video/mp4', 'City Life', 'A day in the city');

-- Insert sample tags for media items
INSERT INTO MediaItemTags (media_id, tag_id) VALUES
(1, 1), -- nature
(1, 3), -- travel
(2, 1), -- nature
(3, 2), -- technology
(3, 3); -- travel

-- Insert sample comments
INSERT INTO Comments (media_id, user_id, comment_text) VALUES
(1, 3, 'Amazing photo! Love the colors.'),
(2, 2, 'Great composition!'),
(1, 2, 'Thanks for sharing!');

-- Insert sample ratings
INSERT INTO MediaItemRatings (media_id, user_id, rating_value) VALUES
(1, 3, 5),
(2, 2, 4),
(3, 2, 5);

-- Display table structures
SHOW TABLES;
