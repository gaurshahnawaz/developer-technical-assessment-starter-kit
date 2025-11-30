-- ================================================
-- Real Estate Platform Database Schema
-- ================================================
-- Created for Oman Housing Bank Technical Assessment
-- Database: PostgreSQL
-- ================================================

-- Drop existing tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS agent_contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS lands CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- ================================================
-- TABLE: users
-- Stores user authentication information
-- ================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store hashed password
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLE: agent_contacts
-- Logs contact requests from users to agents
-- ================================================
CREATE TABLE agent_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('property', 'land', 'project')),
    listing_id UUID NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- TABLE: properties
-- Stores information about properties (villas, apartments, townhouses)
-- ================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- apartment, villa, townhouse, etc.
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
    area DECIMAL(10, 2) NOT NULL CHECK (area > 0), -- in square meters
    images TEXT[], -- Array of image paths
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    features TEXT[], -- Array of features like 'pool', 'garden', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector -- For full-text search
);

-- ================================================
-- TABLE: lands
-- Stores information about land parcels for sale
-- ================================================
CREATE TABLE lands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    location VARCHAR(255) NOT NULL,
    area DECIMAL(10, 2) NOT NULL CHECK (area > 0), -- in square meters
    zoning VARCHAR(100) NOT NULL, -- residential, commercial, agricultural, etc.
    images TEXT[], -- Array of image paths
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    features TEXT[], -- Array of features
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector -- For full-text search
);

-- ================================================
-- TABLE: projects
-- Stores information about real estate development projects
-- ================================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    developer VARCHAR(255) NOT NULL,
    total_units INTEGER NOT NULL CHECK (total_units > 0),
    available_units INTEGER NOT NULL CHECK (available_units >= 0),
    starting_price DECIMAL(10, 2) NOT NULL CHECK (starting_price >= 0),
    images TEXT[], -- Array of image paths
    status VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'upcoming')),
    amenities TEXT[], -- Array of amenities
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    search_vector tsvector -- For full-text search
);

-- ================================================
-- INDEXES for Performance Optimization
-- ================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);

-- Agent contacts indexes
CREATE INDEX idx_agent_contacts_user_id ON agent_contacts(user_id);
CREATE INDEX idx_agent_contacts_listing_type ON agent_contacts(listing_type);
CREATE INDEX idx_agent_contacts_created_at ON agent_contacts(created_at DESC);

-- Properties indexes
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX idx_properties_search_vector ON properties USING GIN(search_vector);

-- Lands indexes
CREATE INDEX idx_lands_status ON lands(status);
CREATE INDEX idx_lands_location ON lands(location);
CREATE INDEX idx_lands_price ON lands(price);
CREATE INDEX idx_lands_zoning ON lands(zoning);
CREATE INDEX idx_lands_created_at ON lands(created_at DESC);
CREATE INDEX idx_lands_search_vector ON lands USING GIN(search_vector);

-- Projects indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_location ON projects(location);
CREATE INDEX idx_projects_developer ON projects(developer);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_search_vector ON projects USING GIN(search_vector);

-- ================================================
-- SAMPLE SEED DATA
-- ================================================

-- Insert sample properties
INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, images, status, features) VALUES
('Luxury Villa in Al Mouj', 'Stunning 4-bedroom villa with private pool and ocean views. Modern design with high-end finishes throughout.', 450000.00, 'Al Mouj, Muscat', 'villa', 4, 4, 450.50, ARRAY['property1.jpg', 'property2.jpg'], 'available', ARRAY['private pool', 'ocean view', 'garden', 'maid room', 'covered parking']),
('Modern Apartment in Qurum', 'Spacious 2-bedroom apartment in prime location. Walking distance to beach and shopping centers.', 120000.00, 'Qurum, Muscat', 'apartment', 2, 2, 150.00, ARRAY['property3.jpg'], 'available', ARRAY['gym access', 'security', 'parking', 'balcony']),
('Family Townhouse in Madinat Al Sultan Qaboos', 'Beautiful 3-bedroom townhouse in gated community with excellent amenities.', 185000.00, 'Madinat Al Sultan Qaboos, Muscat', 'townhouse', 3, 3, 220.75, ARRAY['property4.jpg', 'property5.jpg'], 'available', ARRAY['community pool', 'playground', 'security', 'storage room']),
('Beachfront Villa in Salalah', 'Exclusive beachfront property with direct beach access. Perfect for luxury living.', 650000.00, 'Salalah', 'villa', 5, 5, 550.00, ARRAY['property6.jpg'], 'reserved', ARRAY['beach access', 'infinity pool', 'outdoor kitchen', 'tennis court']),
('Penthouse in The Wave', 'Premium penthouse with panoramic views. Top floor unit with terrace.', 380000.00, 'The Wave, Muscat', 'apartment', 3, 3, 280.00, ARRAY['property7.jpg', 'property8.jpg'], 'available', ARRAY['rooftop terrace', 'concierge', 'smart home', 'sea view']);

-- Insert sample lands
INSERT INTO lands (title, description, price, location, area, zoning, images, status, features) VALUES
('Prime Commercial Land in Muscat Hills', 'Excellent location for commercial development. High visibility and accessibility.', 850000.00, 'Muscat Hills', 2000.00, 'commercial', ARRAY['land1.jpg', 'land2.jpg'], 'available', ARRAY['corner plot', 'paved road access', 'utilities available']),
('Residential Land in Al Hail', 'Perfect for building your dream home. Quiet neighborhood with mountain views.', 175000.00, 'Al Hail, Muscat', 800.50, 'residential', ARRAY['land3.jpg'], 'available', ARRAY['mountain view', 'residential area', 'electricity ready']),
('Waterfront Land in Marina', 'Rare waterfront plot with marina access. Ideal for luxury development.', 1200000.00, 'Marina, Muscat', 1500.00, 'mixed-use', ARRAY['land4.jpg', 'land5.jpg'], 'available', ARRAY['waterfront', 'marina access', 'development permit ready']),
('Agricultural Land in Nizwa', 'Large agricultural land with natural water source. Perfect for farming.', 320000.00, 'Nizwa', 5000.00, 'agricultural', ARRAY['land6.jpg'], 'sold', ARRAY['water source', 'fertile soil', 'farm structures']),
('Investment Land in Sohar', 'Strategic location near industrial zone. Great investment opportunity.', 450000.00, 'Sohar', 3000.00, 'industrial', ARRAY['land7.jpg'], 'available', ARRAY['industrial zone', 'highway access', 'large area']);

-- Insert sample projects
INSERT INTO projects (title, description, location, developer, total_units, available_units, starting_price, images, status, amenities, completion_date) VALUES
('Al Mouj Golf Residences', 'Luxury waterfront development featuring world-class golf course and marina. Premium residential units with stunning views.', 'Al Mouj, Muscat', 'Oman Tourism Development Company', 250, 180, 220000.00, ARRAY['project1.jpg', 'project2.jpg'], 'ongoing', ARRAY['golf course', 'marina', 'swimming pools', 'fitness center', 'restaurants', 'shops', '24/7 security'], '2026-12-31'),
('The Heights Residences', 'Modern high-rise development in the heart of Muscat. Contemporary design with premium amenities.', 'Shatti Al Qurum, Muscat', 'Oman Housing Bank', 180, 120, 180000.00, ARRAY['project3.jpg'], 'ongoing', ARRAY['infinity pool', 'gym', 'spa', 'business center', 'kids playground', 'parking'], '2025-09-30'),
('Salalah Beach Resort', 'Beachfront resort-style living with private beach access. Tropical paradise in Oman.', 'Salalah', 'Omran Group', 150, 95, 350000.00, ARRAY['project4.jpg', 'project5.jpg'], 'upcoming', ARRAY['private beach', 'resort amenities', 'restaurants', 'water sports center', 'spa'], '2027-06-30'),
('Green Valley Villas', 'Eco-friendly villa community with sustainable design. Family-oriented development.', 'Al Khoudh, Muscat', 'Green Homes Oman', 80, 40, 280000.00, ARRAY['project6.jpg'], 'ongoing', ARRAY['solar panels', 'green spaces', 'community center', 'playground', 'jogging track'], '2025-12-31'),
('Marina Bay Towers', 'Twin tower development with marina views. Luxury apartments and penthouses.', 'Marina Bandar Al Rowdha', 'Marina Developers', 200, 165, 195000.00, ARRAY['project7.jpg', 'project8.jpg'], 'completed', ARRAY['marina view', 'infinity pools', 'health club', 'retail spaces', 'valet parking'], '2024-06-30');

-- ================================================
-- UTILITY FUNCTIONS
-- ================================================

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for properties
CREATE OR REPLACE FUNCTION update_properties_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.type, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for lands
CREATE OR REPLACE FUNCTION update_lands_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.zoning, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search_vector for projects
CREATE OR REPLACE FUNCTION update_projects_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.developer, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lands_updated_at BEFORE UPDATE ON lands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_contacts_updated_at BEFORE UPDATE ON agent_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for automatic search vector updates
CREATE TRIGGER update_properties_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_properties_search_vector();

CREATE TRIGGER update_lands_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON lands
    FOR EACH ROW EXECUTE FUNCTION update_lands_search_vector();

CREATE TRIGGER update_projects_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_projects_search_vector();

-- ================================================
-- VERIFICATION QUERIES (for testing)
-- ================================================

-- Uncomment to verify data insertion:
-- SELECT COUNT(*) as total_properties FROM properties;
-- SELECT COUNT(*) as total_lands FROM lands;
-- SELECT COUNT(*) as total_projects FROM projects;

-- ================================================
-- END OF SCRIPT
-- ================================================
