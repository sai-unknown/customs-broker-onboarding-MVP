CREATE TABLE brokers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'BROKER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    broker_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    gstin VARCHAR(15) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('EXPORTER', 'IMPORTER')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer_broker
        FOREIGN KEY (broker_id)
        REFERENCES brokers(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_customers_broker_email
        UNIQUE (broker_id, email),

    CONSTRAINT uq_customers_broker_gstin
        UNIQUE (broker_id, gstin)
);

CREATE INDEX idx_customers_broker_id ON customers(broker_id);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_brokers_email ON brokers(email);
