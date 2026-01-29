-- TerraBond Database Initialization Script
-- Creates all necessary databases for microservices

-- Create databases
CREATE DATABASE terrabond_auth;
CREATE DATABASE terrabond_user;
CREATE DATABASE terrabond_social;
CREATE DATABASE terrabond_travel;
CREATE DATABASE terrabond_messaging;
CREATE DATABASE terrabond_ai;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE terrabond_auth TO terrabond;
GRANT ALL PRIVILEGES ON DATABASE terrabond_user TO terrabond;
GRANT ALL PRIVILEGES ON DATABASE terrabond_social TO terrabond;
GRANT ALL PRIVILEGES ON DATABASE terrabond_travel TO terrabond;
GRANT ALL PRIVILEGES ON DATABASE terrabond_messaging TO terrabond;
GRANT ALL PRIVILEGES ON DATABASE terrabond_ai TO terrabond;

-- Connect to auth database and create tables
\c terrabond_auth;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    bio TEXT,
    profession VARCHAR(100),
    profile_picture VARCHAR(500),
    cover_picture VARCHAR(500),
    face_encoding_data TEXT,
    face_verified BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    personality_type VARCHAR(10),
    personality_traits TEXT,
    dream_countries TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id, role)
);

CREATE TABLE IF NOT EXISTS user_travel_styles (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    style VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, style)
);

CREATE TABLE IF NOT EXISTS user_languages (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, language)
);

CREATE TABLE IF NOT EXISTS user_interests (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, interest)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, first_name, last_name, username, is_verified, is_active)
VALUES ('admin@terrabond.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjJAgqK0J6zJ9QJ9QJ9QJ9QJ9QJ9QJ9', 'Admin', 'User', 'admin', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role)
SELECT id, 'ADMIN' FROM users WHERE email = 'admin@terrabond.com'
ON CONFLICT DO NOTHING;

\c terrabond_social;

CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    type VARCHAR(20) DEFAULT 'POST',
    media_urls TEXT[],
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    privacy VARCHAR(20) DEFAULT 'PUBLIC',
    hashtags TEXT[],
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stories (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'IMAGE',
    media_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    text_content TEXT,
    text_color VARCHAR(20),
    background_color VARCHAR(20),
    location VARCHAR(255),
    duration INTEGER DEFAULT 5,
    expires_at TIMESTAMP NOT NULL,
    is_highlight BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_edited BOOLEAN DEFAULT FALSE,
    post_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_likes (
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS story_views (
    story_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (story_id, user_id)
);

-- Create indexes
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_stories_expires ON stories(expires_at);
CREATE INDEX idx_comments_post ON comments(post_id);

\c terrabond_travel;

CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(500),
    website VARCHAR(255),
    type VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_offers (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255) NOT NULL,
    departure_city VARCHAR(255),
    country VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    images TEXT[],
    activities TEXT[],
    type VARCHAR(50),
    difficulty VARCHAR(20),
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    organizer_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    number_of_participants INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    special_requests TEXT,
    user_id BIGINT NOT NULL,
    travel_offer_id BIGINT NOT NULL,
    payment_id BIGINT
);

CREATE TABLE IF NOT EXISTS travel_logs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    images TEXT[],
    highlights TEXT[],
    tips TEXT[],
    rating INTEGER,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    author_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_travel_offers_destination ON travel_offers(destination);
CREATE INDEX idx_travel_offers_dates ON travel_offers(start_date, end_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);

\c terrabond_messaging;

CREATE TABLE IF NOT EXISTS conversations (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'DIRECT',
    name VARCHAR(255),
    avatar VARCHAR(500),
    last_message_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    type VARCHAR(20) DEFAULT 'TEXT',
    media_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    sender_id BIGINT NOT NULL,
    conversation_id BIGINT NOT NULL,
    reply_to_story_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS message_read_receipts (
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, user_id)
);

-- Create indexes
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

\c terrabond_ai;

CREATE TABLE IF NOT EXISTS personality_tests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    answers JSONB NOT NULL,
    personality_type VARCHAR(10),
    traits JSONB,
    openness DECIMAL(5, 2),
    conscientiousness DECIMAL(5, 2),
    extraversion DECIMAL(5, 2),
    agreeableness DECIMAL(5, 2),
    neuroticism DECIMAL(5, 2),
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    compatibility_score DECIMAL(5, 2) NOT NULL,
    match_reasons TEXT[],
    common_interests TEXT[],
    common_destinations TEXT[],
    user1_viewed BOOLEAN DEFAULT FALSE,
    user2_viewed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS connections (
    id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    message TEXT,
    match_reason TEXT,
    compatibility_score DECIMAL(5, 2),
    ai_suggested BOOLEAN DEFAULT FALSE,
    common_interests TEXT[],
    common_destinations TEXT[],
    accepted_at TIMESTAMP,
    blocked_at TIMESTAMP,
    interaction_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    recommended_id BIGINT NOT NULL,
    recommendation_type VARCHAR(50),
    score DECIMAL(5, 2),
    reason TEXT,
    is_viewed BOOLEAN DEFAULT FALSE,
    is_clicked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_connections_requester ON connections(requester_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_recommendations_user ON ai_recommendations(user_id);
