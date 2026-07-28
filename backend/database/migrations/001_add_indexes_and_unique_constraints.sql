-- Run this against an existing database to add constraints and indexes
-- Safe to run multiple times (uses IF NOT EXISTS where supported)

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_broker_email_idx
    ON customers (broker_id, email);

CREATE UNIQUE INDEX IF NOT EXISTS uq_customers_broker_gstin_idx
    ON customers (broker_id, gstin);

CREATE INDEX IF NOT EXISTS idx_customers_broker_id ON customers(broker_id);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_brokers_email ON brokers(email);
