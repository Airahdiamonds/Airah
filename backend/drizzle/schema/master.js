import { decimal, pgTable, serial } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'

export const masterTable = pgTable('master', {
	master_id: serial('master_id').primaryKey(),
	GBP_rate: decimal(19, 2),
	INR_rate: decimal(19, 2),
	AUD_rate: decimal(19, 2),
	AED_rate: decimal(19, 2),
	OMR_rate: decimal(19, 2),
	EUR_rate: decimal(19, 2),
	gold_rate: decimal(19, 2),
	diamond_rate: decimal(19, 2),
	created_at,
	updated_at,
})
