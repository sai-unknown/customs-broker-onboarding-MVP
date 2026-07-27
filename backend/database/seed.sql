INSERT INTO brokers (
    name,
    email,
    password_hash
)
VALUES (
    'Sai Customs Broker',
    'sai@example.com',
    '$2b$10$ReplaceWithRealBcryptHashLater'
);

INSERT INTO customers (
    broker_id,
    name,
    email,
    gstin,
    type
)
VALUES
(
    1,
    'ABC Exports Pvt Ltd',
    'abc@exports.com',
    '29ABCDE1234F1Z5',
    'EXPORTER'
),
(
    1,
    'XYZ Imports Pvt Ltd',
    'xyz@imports.com',
    '36XYZAB5678C1Z2',
    'IMPORTER'
);