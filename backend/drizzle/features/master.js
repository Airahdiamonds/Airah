import { eq, ilike } from 'drizzle-orm'
import { db } from '../db.js'
import { diamondsTable } from '../schema/diamonds.js'
import { masterTable } from '../schema/master.js'
import { ringStylesTable } from '../schema/ringStyles.js'
import { productsTable } from '../schema/products.js'
import { couponsTable } from '../schema/coupons.js'

export async function getMasterList() {
	const products = await db.select().from(masterTable)

	if (products == null) throw new Error('Failed to get all masters')

	return products
}

export async function addMasterEntry(data) {
	const newProduct = await db.insert(masterTable).values(data).returning()

	if (newProduct == null) throw new Error('Failed to insert master')

	return { success: true }
}

export async function getCouponList() {
	const products = await db.select().from(couponsTable)

	if (products == null) throw new Error('Failed to get all coupons')

	return products
}

export async function addCouponEntry(data) {
	const newProduct = await db.insert(couponsTable).values(data).returning()

	if (newProduct == null) throw new Error('Failed to insert coupon')

	return { success: true }
}

export async function searchProducts(search) {
	const diamondResults = await db
		.select()
		.from(diamondsTable)
		.where(ilike(diamondsTable.name, `%${search}%`))

	const ringStyleResults = await db
		.select()
		.from(ringStylesTable)
		.where(ilike(ringStylesTable.name, `%${search}%`))

	const productResults = await db
		.select()
		.from(productsTable)
		.where(ilike(productsTable.name, `%${search}%`))

	const combinedResults = [
		...diamondResults.map((item) => ({ ...item, type: 1 })),
		...ringStyleResults.map((item) => ({ ...item, type: 2 })),
		...productResults.map((item) => ({ ...item, type: 3 })),
	]
	return combinedResults
}

export async function validateCoupon(couponCode) {
	const couponArray = await db
		.select()
		.from(couponsTable)
		.where(eq(couponsTable.code, couponCode))
		.limit(1)

	if (!couponArray || couponArray.length === 0) {
		throw new Error('Invalid coupon')
	}

	const coupon = couponArray[0]

	const currentDate = new Date()
	const expiryDate = new Date(coupon.expiry_date)

	if (expiryDate < currentDate) {
		throw new Error('Coupon has expired')
	}

	if (coupon.used_count >= coupon.max_uses) {
		throw new Error('Coupon has been used too many times')
	}

	return {
		success: true,
		discount: coupon.discount_percentage,
	}
}
