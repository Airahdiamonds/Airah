import { pgTable, text, integer, date, serial } from 'drizzle-orm/pg-core'

export const couponsTable = pgTable('coupons', {
	coupon_id: serial('coupon_id').primaryKey(),
	code: text().notNull().unique(),
	discount_percentage: integer().notNull(),
	expiry_date: date().notNull(),
	max_uses: integer().default(1),
})
