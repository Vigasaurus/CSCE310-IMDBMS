const postgres = require('postgres');

const sql = postgres(
	`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_SERVER}:${process.env.DB_PORT}/${process.env.DB_PROD}`
);

module.exports = sql;
