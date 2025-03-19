import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	out: './drizzle/migrations',
	schema: './drizzle/schema.js',
	strict: true,
	verbose: true,
	dialect: 'postgresql',
	dbCredentials: {
		password: process.env.DB_PASSWORD,
		user: process.env.DB_USER,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		ssl: false,
	},
})
