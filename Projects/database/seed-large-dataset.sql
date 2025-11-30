-- ================================================
-- Large Dataset Seeding Script
-- Generates 1000+ realistic records for performance testing
-- ================================================

-- Generate 400 properties
DO $$
DECLARE
    property_types TEXT[] := ARRAY['villa', 'apartment', 'townhouse', 'penthouse', 'studio'];
    locations TEXT[] := ARRAY['Al Mouj, Muscat', 'Qurum, Muscat', 'Madinat Al Sultan Qaboos', 'The Wave, Muscat', 
                               'Shatti Al Qurum', 'Al Khuwair', 'Azaiba', 'Ghubrah', 'Ruwi', 'Salalah', 
                               'Sohar', 'Nizwa', 'Sur', 'Ibri', 'Al Hail', 'Muscat Hills', 'Bousher', 
                               'Marina Bandar Al Rowdha', 'Al Khoudh', 'Seeb'];
    statuses TEXT[] := ARRAY['available', 'sold', 'reserved'];
    i INTEGER;
    random_type TEXT;
    random_location TEXT;
    random_status TEXT;
    random_bedrooms INTEGER;
    random_bathrooms INTEGER;
    random_area DECIMAL;
    random_price DECIMAL;
BEGIN
    FOR i IN 1..400 LOOP
        random_type := property_types[1 + floor(random() * array_length(property_types, 1))::int];
        random_location := locations[1 + floor(random() * array_length(locations, 1))::int];
        random_status := statuses[1 + floor(random() * array_length(statuses, 1))::int];
        
        -- Generate realistic bedroom/bathroom counts based on type
        IF random_type = 'studio' THEN
            random_bedrooms := 0;
            random_bathrooms := 1;
            random_area := 40 + random() * 60; -- 40-100 sqm
            random_price := 60000 + random() * 80000; -- 60k-140k
        ELSIF random_type = 'apartment' THEN
            random_bedrooms := 1 + floor(random() * 3)::int; -- 1-3 bedrooms
            random_bathrooms := 1 + floor(random() * 2)::int; -- 1-2 bathrooms
            random_area := 80 + random() * 170; -- 80-250 sqm
            random_price := 90000 + random() * 310000; -- 90k-400k
        ELSIF random_type = 'townhouse' THEN
            random_bedrooms := 2 + floor(random() * 3)::int; -- 2-4 bedrooms
            random_bathrooms := 2 + floor(random() * 2)::int; -- 2-3 bathrooms
            random_area := 150 + random() * 200; -- 150-350 sqm
            random_price := 150000 + random() * 300000; -- 150k-450k
        ELSIF random_type = 'penthouse' THEN
            random_bedrooms := 3 + floor(random() * 3)::int; -- 3-5 bedrooms
            random_bathrooms := 3 + floor(random() * 3)::int; -- 3-5 bathrooms
            random_area := 250 + random() * 350; -- 250-600 sqm
            random_price := 350000 + random() * 650000; -- 350k-1M
        ELSE -- villa
            random_bedrooms := 3 + floor(random() * 4)::int; -- 3-6 bedrooms
            random_bathrooms := 3 + floor(random() * 4)::int; -- 3-6 bathrooms
            random_area := 300 + random() * 450; -- 300-750 sqm
            random_price := 300000 + random() * 900000; -- 300k-1.2M
        END IF;
        
        INSERT INTO properties (title, description, price, location, type, bedrooms, bathrooms, area, images, status, features)
        VALUES (
            'Modern ' || initcap(random_type) || ' in ' || split_part(random_location, ',', 1),
            'Beautifully designed ' || random_type || ' featuring contemporary architecture and premium finishes. Located in ' || random_location || ', this property offers excellent value and modern living standards with quality construction and attention to detail.',
            round(random_price::numeric, 2),
            random_location,
            random_type,
            random_bedrooms,
            random_bathrooms,
            round(random_area::numeric, 2),
            ARRAY['property' || i || '_1.jpg', 'property' || i || '_2.jpg', 'property' || i || '_3.jpg'],
            random_status,
            CASE 
                WHEN random() > 0.7 THEN ARRAY['parking', 'security', 'gym', 'pool', 'garden']
                WHEN random() > 0.4 THEN ARRAY['parking', 'security', 'balcony']
                ELSE ARRAY['parking', 'security']
            END
        );
    END LOOP;
END $$;

-- Generate 300 lands
DO $$
DECLARE
    zoning_types TEXT[] := ARRAY['residential', 'commercial', 'industrial', 'agricultural', 'mixed-use'];
    locations TEXT[] := ARRAY['Muscat Hills', 'Al Hail, Muscat', 'Marina, Muscat', 'Nizwa', 'Sohar', 
                               'Salalah', 'Sur', 'Ibri', 'Al Khoudh', 'Barka', 'Bousher', 'Seeb', 
                               'Al Amerat', 'Quriyat', 'Rustaq', 'Bahla', 'Ibra', 'Bidbid'];
    statuses TEXT[] := ARRAY['available', 'sold', 'reserved'];
    i INTEGER;
    random_zoning TEXT;
    random_location TEXT;
    random_status TEXT;
    random_area DECIMAL;
    random_price DECIMAL;
BEGIN
    FOR i IN 1..300 LOOP
        random_zoning := zoning_types[1 + floor(random() * array_length(zoning_types, 1))::int];
        random_location := locations[1 + floor(random() * array_length(locations, 1))::int];
        random_status := statuses[1 + floor(random() * array_length(statuses, 1))::int];
        
        -- Generate realistic area and price based on zoning
        IF random_zoning = 'residential' THEN
            random_area := 500 + random() * 2000; -- 500-2500 sqm
            random_price := 100000 + random() * 400000; -- 100k-500k
        ELSIF random_zoning = 'commercial' THEN
            random_area := 1000 + random() * 4000; -- 1000-5000 sqm
            random_price := 400000 + random() * 1600000; -- 400k-2M
        ELSIF random_zoning = 'industrial' THEN
            random_area := 2000 + random() * 8000; -- 2000-10000 sqm
            random_price := 300000 + random() * 1200000; -- 300k-1.5M
        ELSIF random_zoning = 'agricultural' THEN
            random_area := 5000 + random() * 20000; -- 5000-25000 sqm
            random_price := 150000 + random() * 600000; -- 150k-750k
        ELSE -- mixed-use
            random_area := 1500 + random() * 3500; -- 1500-5000 sqm
            random_price := 500000 + random() * 1500000; -- 500k-2M
        END IF;
        
        INSERT INTO lands (title, description, price, location, area, zoning, images, status, features)
        VALUES (
            initcap(random_zoning) || ' Land in ' || random_location,
            'Prime ' || random_zoning || ' land parcel in ' || random_location || '. Excellent investment opportunity with strategic location and easy access. Suitable for development with all necessary utilities available or planned.',
            round(random_price::numeric, 2),
            random_location,
            round(random_area::numeric, 2),
            random_zoning,
            ARRAY['land' || i || '_1.jpg', 'land' || i || '_2.jpg'],
            random_status,
            CASE 
                WHEN random() > 0.6 THEN ARRAY['utilities available', 'paved road access', 'corner plot']
                ELSE ARRAY['utilities available', 'road access']
            END
        );
    END LOOP;
END $$;

-- Generate 300 projects
DO $$
DECLARE
    developers TEXT[] := ARRAY['Oman Tourism Development Company', 'Omran Group', 'Oman Housing Bank', 
                                'Green Homes Oman', 'Marina Developers', 'Gulf Properties', 'Al Madina Group',
                                'Muscat Development', 'Salalah Resorts', 'Wave Developers', 'Urban Living Oman'];
    locations TEXT[] := ARRAY['Al Mouj, Muscat', 'Shatti Al Qurum, Muscat', 'Salalah', 'Al Khoudh, Muscat',
                               'Marina Bandar Al Rowdha', 'The Wave, Muscat', 'Muscat Hills', 'Azaiba',
                               'Ghubrah', 'Sohar', 'Sur', 'Nizwa', 'Bousher', 'Seeb', 'Al Hail'];
    statuses TEXT[] := ARRAY['ongoing', 'completed', 'upcoming'];
    i INTEGER;
    random_developer TEXT;
    random_location TEXT;
    random_status TEXT;
    random_total_units INTEGER;
    random_available_units INTEGER;
    random_starting_price DECIMAL;
    random_completion_date DATE;
BEGIN
    FOR i IN 1..300 LOOP
        random_developer := developers[1 + floor(random() * array_length(developers, 1))::int];
        random_location := locations[1 + floor(random() * array_length(locations, 1))::int];
        random_status := statuses[1 + floor(random() * array_length(statuses, 1))::int];
        
        random_total_units := 50 + floor(random() * 400)::int; -- 50-450 units
        
        IF random_status = 'completed' THEN
            random_available_units := floor(random() * (random_total_units * 0.3))::int;
        ELSIF random_status = 'ongoing' THEN
            random_available_units := floor(random_total_units * 0.4 + random() * (random_total_units * 0.4))::int;
        ELSE -- upcoming
            random_available_units := random_total_units;
        END IF;
        
        random_starting_price := 120000 + random() * 380000; -- 120k-500k
        
        -- Generate completion date based on status
        IF random_status = 'completed' THEN
            random_completion_date := CURRENT_DATE - (floor(random() * 730)::int || ' days')::interval;
        ELSIF random_status = 'ongoing' THEN
            random_completion_date := CURRENT_DATE + (floor(random() * 730 + 180)::int || ' days')::interval;
        ELSE -- upcoming
            random_completion_date := CURRENT_DATE + (floor(random() * 1095 + 365)::int || ' days')::interval;
        END IF;
        
        INSERT INTO projects (title, description, location, developer, total_units, available_units, starting_price, images, status, amenities, completion_date)
        VALUES (
            CASE 
                WHEN random() > 0.7 THEN split_part(random_location, ',', 1) || ' Residences'
                WHEN random() > 0.4 THEN split_part(random_location, ',', 1) || ' Towers'
                ELSE split_part(random_location, ',', 1) || ' Gardens'
            END,
            'Premium mixed-use development by ' || random_developer || ' in ' || random_location || '. This project offers world-class amenities and modern living spaces with sustainable design principles. Features state-of-the-art facilities and contemporary architecture.',
            random_location,
            random_developer,
            random_total_units,
            random_available_units,
            round(random_starting_price::numeric, 2),
            ARRAY['project' || i || '_1.jpg', 'project' || i || '_2.jpg', 'project' || i || '_3.jpg'],
            random_status,
            CASE 
                WHEN random() > 0.7 THEN ARRAY['swimming pool', 'gym', 'spa', 'kids playground', 'parking', 'security', 'retail spaces']
                WHEN random() > 0.4 THEN ARRAY['swimming pool', 'gym', 'parking', 'security', 'landscaped gardens']
                ELSE ARRAY['gym', 'parking', 'security', '24/7 maintenance']
            END,
            random_completion_date
        );
    END LOOP;
END $$;

-- Insert sample users for testing
INSERT INTO users (email, password, first_name, last_name, phone) VALUES
('john.doe@example.com', '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOXxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'John', 'Doe', '+968 91234567'),
('jane.smith@example.com', '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOXxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'Jane', 'Smith', '+968 92345678'),
('ahmed.ali@example.com', '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOXxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'Ahmed', 'Ali', '+968 93456789'),
('fatima.omar@example.com', '$2b$10$rQZ5YJ5YJ5YJ5YJ5YJ5YJOXxKxKxKxKxKxKxKxKxKxKxKxKxKxKxK', 'Fatima', 'Omar', '+968 94567890');
-- Note: Password hash above is just a placeholder. Actual implementation will use properly hashed passwords.

-- Verify counts
SELECT 
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(*) FROM lands) as total_lands,
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM properties) + (SELECT COUNT(*) FROM lands) + (SELECT COUNT(*) FROM projects) as grand_total;
