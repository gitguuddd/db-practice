CREATE table events (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_location ON events USING GIST (location);

CREATE INDEX idx_events_metadata_owner ON events ((metadata->>'owner'));