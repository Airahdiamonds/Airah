import { defineConfig } from 'drizzle-kit'
import dotenv from 'dotenv'

const envFile =
	process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })

export default defineConfig({
	out: './drizzle/migrations',
	schema: './drizzle/schema.js',
	strict: true,
	verbose: true,
	dialect: 'postgresql',
	dbCredentials: {
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		ssl: false,
	},
})
