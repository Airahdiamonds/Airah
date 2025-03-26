import { db } from './db.js'
import { couponsTable } from './schema/coupons.js'
import { diamondsTable } from './schema/diamonds.js'
import { masterTable } from './schema/master.js'
import { productsTable } from './schema/products.js'
import { ringStylesTable } from './schema/ringStyles.js'

// Run seeding inside an async function
async function seed() {
	try {
		// =========================
		// MASTER TABLE SEEDING
		// =========================
		const existingMaster = await db.select().from(masterTable).limit(1)
		if (existingMaster.length === 0) {
			await db.insert(masterTable).values({
				GBP_rate: '1.23',
				INR_rate: '83.45',
				gold_rate: '5000',
				diamond_rate: '100',
				created_at: new Date(),
				updated_at: new Date(),
			})
			console.log('✅ Seeded masterTable')
		} else {
			console.log('ℹ️ masterTable already has data, skipping.')
		}

		// =========================
		// COUPONS TABLE SEEDING
		// =========================
		const existingCoupon = await db.select().from(couponsTable).limit(1)
		if (existingCoupon.length === 0) {
			await db.insert(couponsTable).values({
				code: 'PREM',
				discount_percentage: 25,
				expiry_date: '2025-03-25',
				max_uses: 2,
			})
			console.log('✅ Seeded couponsTable')
		} else {
			console.log('ℹ️ couponsTable already has data, skipping.')
		}

		// =========================
		// PRODUCTS TABLE SEEDING
		// =========================
		const existingProducts = await db.select().from(productsTable).limit(1)
		if (existingProducts.length === 0) {
			await db.insert(productsTable).values([
				{
					SKU: 'PROD001',
					name: 'Elegant Diamond Ring',
					category: 'ring',
					description: 'A beautifully crafted diamond ring.',
					image_URL: ['/ring2.jpg', '/Wedding-rings.jpg'],
					gold_quantity: '1',
					gold_price: '100',
					gold_total: '100',
					round_quantity: '1',
					round_price: '100',
					round_total: '100',
					oval_quantity: '1',
					oval_price: '100',
					oval_total: '100',
					marquise_quantity: '1',
					marquise_price: '100',
					marquise_total: '100',
					emerald_quantity: '1',
					emerald_price: '100',
					emerald_total: '100',
					princess_quantity: '1',
					princess_price: '100',
					princess_total: '100',
					pear_quantity: '1',
					pear_price: '100',
					pear_total: '100',
					heart_quantity: '1',
					heart_price: '100',
					heart_total: '100',
					other_diamond_quantity: '1',
					other_diamond_price: '100',
					other_diamond_total: '100',
					gemstone_quantity: '1',
					gemstone_price: '100',
					gemstone_total: '100',
					misc_cost: '10',
					labour_cost: '10',
					other_cost: '10',
					total_cost: '5900',
					created_at: new Date(),
					updated_at: new Date(),
				},
			])
			console.log('✅ Seeded productsTable')
		} else {
			console.log('ℹ️ productsTable already has data, skipping.')
		}

		// =========================
		// DIAMONDS TABLE SEEDING
		// =========================
		const existingDiamonds = await db.select().from(diamondsTable).limit(1)
		if (existingDiamonds.length === 0) {
			await db.insert(diamondsTable).values([
				{
					SKU: 'DIAMOND001',
					name: 'Brilliant Cut Diamond',
					description: 'Flawless diamond with brilliant cut.',
					size: '1',
					image_URL: ['/ring2.jpg', '/Wedding-rings.jpg'],
					shape: 'round',
					cut: 'regular',
					color: 'D',
					clarity: 'IF',
					price: '80',
					created_at: new Date(),
					updated_at: new Date(),
				},
			])
			console.log('✅ Seeded diamondsTable')
		} else {
			console.log('ℹ️ diamondsTable already has data, skipping.')
		}

		// =========================
		// RING STYLES TABLE SEEDING
		// =========================
		const existingRingStyles = await db.select().from(ringStylesTable).limit(1)
		if (existingRingStyles.length === 0) {
			await db.insert(ringStylesTable).values([
				{
					SKU: 'RINGSTYLE001',
					name: 'Classic Solitaire',
					description: 'Timeless solitaire ring style.',
					image_URL: ['/ring2.jpg', '/Wedding-rings.jpg'],
					head_style: 'Four Prong',
					head_style_price: '200',
					head_metal: '14K White Gold',
					head_metal_price: '300',
					shank_style: 'Solitaire',
					shank_style_price: '150',
					shank_metal: '14K White Gold',
					shank_metal_price: '250',
					created_at: new Date(),
					updated_at: new Date(),
				},
			])
			console.log('✅ Seeded ringStylesTable')
		} else {
			console.log('ℹ️ ringStylesTable already has data, skipping.')
		}

		console.log('🎉 Seeding completed successfully!')
		process.exit(0)
	} catch (error) {
		console.error('❌ Seeding failed:', error)
		process.exit(1)
	}
}

seed()
