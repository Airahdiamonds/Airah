import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv'
const envFile =
	process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'

dotenv.config({ path: envFile })

const connection = postgres(process.env.DATABASE_URL, { ssl: false })
export const db = drizzle(connection)
