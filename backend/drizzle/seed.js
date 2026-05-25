import { db } from './db.js'
import { adminTable } from './schema/admin.js'
import { addressesTable } from './schema/addresses.js'
import { cartTable } from './schema/cart.js'
import { couponsTable } from './schema/coupons.js'
import { diamondsTable } from './schema/diamonds.js'
import { favoritesTable } from './schema/favorites.js'
import { masterTable } from './schema/master.js'
import { orderItemsTable } from './schema/orderItems.js'
import { ordersTable } from './schema/orders.js'
import { productsTable } from './schema/products.js'
import { reviewsTable } from './schema/reviews.js'
import { ringStylesTable } from './schema/ringStyles.js'
import { transactionsTable } from './schema/transactions.js'
import { userTable } from './schema/users.js'
import { generateSalt, hashPassword } from '../passwordHasher.js'
import { randomUUID } from 'crypto'

async function makeCredential(plain) {
	const salt = generateSalt()
	const password = await hashPassword(plain, salt)
	return { salt, password }
}

async function seed() {
	try {
		// =========================
		// MASTER TABLE SEEDING
		// =========================
		const existingMaster = await db.select().from(masterTable).limit(1)
		if (existingMaster.length === 0) {
			await db.insert(masterTable).values({
				GBP_rate: '0.0091',
				USD_rate: '0.012',
				AUD_rate: '0.019',
				AED_rate: '0.043',
				OMR_rate: '0.0045',
				EUR_rate: '0.011',
				gold_rate: '5000',
				diamond_rate: '100',
			})
			console.log('✅ Seeded masterTable')
		} else {
			console.log('ℹ️ masterTable already has data, skipping.')
		}

		// =========================
		// ADMIN TABLE SEEDING
		// =========================
		const existingAdmin = await db.select().from(adminTable).limit(1)
		if (existingAdmin.length === 0) {
			const admin = await makeCredential('admin@123')
			await db.insert(adminTable).values({
				name: 'Airah Admin',
				email: 'admin@airah.com',
				password: admin.password,
				salt: admin.salt,
			})
			console.log('✅ Seeded adminTable')
		} else {
			console.log('ℹ️ adminTable already has data, skipping.')
		}

		// =========================
		// COUPONS TABLE SEEDING
		// =========================
		const existingCoupon = await db.select().from(couponsTable).limit(1)
		if (existingCoupon.length === 0) {
			await db.insert(couponsTable).values([
				{ code: 'PREM', discount_percentage: 25, expiry_date: '2026-12-31', max_uses: 5 },
				{ code: 'WELCOME10', discount_percentage: 10, expiry_date: '2026-12-31', max_uses: 100 },
				{ code: 'FESTIVE20', discount_percentage: 20, expiry_date: '2026-11-30', max_uses: 50 },
				{ code: 'BRIDAL15', discount_percentage: 15, expiry_date: '2026-09-30', max_uses: 30 },
				{ code: 'DIWALI30', discount_percentage: 30, expiry_date: '2026-11-15', max_uses: 20 },
				{ code: 'FLAT5', discount_percentage: 5, expiry_date: '2027-01-31', max_uses: 200 },
			])
			console.log('✅ Seeded couponsTable')
		} else {
			console.log('ℹ️ couponsTable already has data, skipping.')
		}

		// =========================
		// USERS TABLE SEEDING
		// =========================
		let users = await db.select().from(userTable)
		if (users.length === 0) {
			const userSeeds = [
				{ name: 'Prem Vimal', email: 'prem@example.com', plain: 'prem@123', role: 'user' },
				{ name: 'Aarav Mehta', email: 'aarav.mehta@example.com', plain: 'aarav@123', role: 'user' },
				{ name: 'Diya Sharma', email: 'diya.sharma@example.com', plain: 'diya@123', role: 'user' },
				{ name: 'Rohan Iyer', email: 'rohan.iyer@example.com', plain: 'rohan@123', role: 'user' },
				{ name: 'Isha Kapoor', email: 'isha.kapoor@example.com', plain: 'isha@123', role: 'user' },
				{ name: 'Vivaan Joshi', email: 'vivaan.joshi@example.com', plain: 'vivaan@123', role: 'user' },
				{ name: 'Anaya Reddy', email: 'anaya.reddy@example.com', plain: 'anaya@123', role: 'user' },
				{ name: 'Site Admin', email: 'siteadmin@airah.com', plain: 'siteadmin@123', role: 'admin' },
			]
			const rows = []
			for (const u of userSeeds) {
				const { salt, password } = await makeCredential(u.plain)
				rows.push({ name: u.name, email: u.email, password, salt, role: u.role })
			}
			users = await db.insert(userTable).values(rows).returning()
			console.log(`✅ Seeded userTable (${users.length} users)`)
		} else {
			console.log('ℹ️ userTable already has data, skipping.')
		}

		// =========================
		// PRODUCTS TABLE SEEDING
		// =========================
		let products = await db.select().from(productsTable)
		if (products.length === 0) {
			const baseDiamondCols = {
				gold_quantity: '1',
				gold_price: '5000',
				gold_total: '5000',
				round_quantity: '0',
				round_price: '0',
				round_total: '0',
				oval_quantity: '0',
				oval_price: '0',
				oval_total: '0',
				marquise_quantity: '0',
				marquise_price: '0',
				marquise_total: '0',
				emerald_quantity: '0',
				emerald_price: '0',
				emerald_total: '0',
				princess_quantity: '0',
				princess_price: '0',
				princess_total: '0',
				pear_quantity: '0',
				pear_price: '0',
				pear_total: '0',
				heart_quantity: '0',
				heart_price: '0',
				heart_total: '0',
				other_diamond_quantity: '0',
				other_diamond_price: '0',
				other_diamond_total: '0',
				gemstone_quantity: '0',
				gemstone_price: '0',
				gemstone_total: '0',
				misc_cost: '50',
				labour_cost: '500',
				other_cost: '100',
			}

			const productSeeds = [
				{
					SKU: 'RING-STK-001',
					name: 'Elegant Stackable Diamond Ring',
					segment: 'Bridal',
					category: 'ring',
					subCategory: 'Stackable Rings',
					description: 'A beautifully crafted stackable diamond ring in 18K gold.',
					tags: ['diamond', 'gold', 'ring', 'stackable'],
					image_URL: ['/ring2.jpg', '/Wedding-rings.jpg'],
					stock_qty: 12,
					overrides: {
						round_quantity: '6',
						round_price: '150',
						round_total: '900',
						total_cost: '6550',
					},
				},
				{
					SKU: 'RING-BIRTH-002',
					name: 'Birthstone Sapphire Ring',
					segment: 'Birthstone',
					category: 'ring',
					subCategory: 'Birthstone Rings',
					description: 'Royal blue sapphire centerpiece with diamond accents.',
					tags: ['sapphire', 'gemstone', 'ring'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 8,
					overrides: {
						gemstone_quantity: '1',
						gemstone_price: '4000',
						gemstone_total: '4000',
						round_quantity: '8',
						round_price: '120',
						round_total: '960',
						total_cost: '10610',
					},
				},
				{
					SKU: 'RING-ETN-003',
					name: 'Full Eternity Diamond Band',
					segment: 'Bridal',
					category: 'ring',
					subCategory: 'Eternity Rings',
					description: 'Brilliant round diamonds set all the way around the band.',
					tags: ['eternity', 'diamond', 'band'],
					image_URL: ['/Wedding-rings.jpg', '/ring2.jpg'],
					stock_qty: 6,
					overrides: {
						round_quantity: '22',
						round_price: '180',
						round_total: '3960',
						total_cost: '9610',
					},
				},
				{
					SKU: 'RING-FSH-004',
					name: 'Fashion Cocktail Ring',
					segment: 'Fashion',
					category: 'ring',
					subCategory: 'Fashion Rings',
					description: 'Bold marquise cluster cocktail ring for statement nights.',
					tags: ['cocktail', 'marquise', 'fashion'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 4,
					overrides: {
						marquise_quantity: '5',
						marquise_price: '220',
						marquise_total: '1100',
						round_quantity: '14',
						round_price: '90',
						round_total: '1260',
						total_cost: '7910',
					},
				},
				{
					SKU: 'EAR-STD-005',
					name: 'Classic Diamond Stud Earrings',
					segment: 'Everyday',
					category: 'necklace',
					subCategory: 'Stud Earrings',
					description: 'Pair of 0.5ct round brilliant stud earrings.',
					tags: ['stud', 'earring', 'diamond'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 15,
					overrides: {
						round_quantity: '2',
						round_price: '900',
						round_total: '1800',
						total_cost: '7450',
					},
				},
				{
					SKU: 'EAR-HOOP-006',
					name: 'Pave Hoop Earrings',
					segment: 'Fashion',
					category: 'necklace',
					subCategory: 'Hoop Earrings',
					description: 'Diamond-pave hoops in 18K white gold.',
					tags: ['hoop', 'pave', 'earring'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 10,
					overrides: {
						round_quantity: '36',
						round_price: '60',
						round_total: '2160',
						total_cost: '7810',
					},
				},
				{
					SKU: 'EAR-DROP-007',
					name: 'Pear Drop Earrings',
					segment: 'Bridal',
					category: 'necklace',
					subCategory: 'Drop Earrings',
					description: 'Elegant pear-cut drop earrings with halo accents.',
					tags: ['drop', 'pear', 'earring'],
					image_URL: ['/Wedding-rings.jpg'],
					stock_qty: 7,
					overrides: {
						pear_quantity: '2',
						pear_price: '850',
						pear_total: '1700',
						round_quantity: '24',
						round_price: '60',
						round_total: '1440',
						total_cost: '8790',
					},
				},
				{
					SKU: 'BRC-TENN-008',
					name: 'Tennis Bracelet Classic',
					segment: 'Bridal',
					category: 'bracelet',
					subCategory: 'Tennis Bracelets',
					description: 'Continuous line of round diamonds in 18K gold.',
					tags: ['tennis', 'bracelet', 'diamond'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 5,
					overrides: {
						round_quantity: '52',
						round_price: '150',
						round_total: '7800',
						total_cost: '13450',
					},
				},
				{
					SKU: 'BRC-BAN-009',
					name: 'Diamond Bangle Bracelet',
					segment: 'Fashion',
					category: 'bracelet',
					subCategory: 'Bangle Bracelets',
					description: 'Sleek 18K bangle with channel-set diamonds.',
					tags: ['bangle', 'bracelet'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 6,
					overrides: {
						round_quantity: '20',
						round_price: '110',
						round_total: '2200',
						total_cost: '7850',
					},
				},
				{
					SKU: 'BRC-CHRM-010',
					name: 'Charm Bracelet Heart',
					segment: 'Gifting',
					category: 'bracelet',
					subCategory: 'Charm Bracelets',
					description: 'Heart-charm bracelet with bezel-set diamond.',
					tags: ['charm', 'heart', 'bracelet'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 9,
					overrides: {
						heart_quantity: '1',
						heart_price: '1200',
						heart_total: '1200',
						total_cost: '6850',
					},
				},
				{
					SKU: 'NEC-PEND-011',
					name: 'Solitaire Pendant Necklace',
					segment: 'Bridal',
					category: 'pendant',
					subCategory: 'Pendant Necklaces',
					description: 'Classic solitaire pendant on an 18-inch chain.',
					tags: ['pendant', 'necklace', 'solitaire'],
					image_URL: ['/Wedding-rings.jpg'],
					stock_qty: 10,
					overrides: {
						round_quantity: '1',
						round_price: '2500',
						round_total: '2500',
						total_cost: '8150',
					},
				},
				{
					SKU: 'NEC-CHK-012',
					name: 'Diamond Choker Necklace',
					segment: 'Bridal',
					category: 'necklace',
					subCategory: 'Choker Necklaces',
					description: 'Statement choker with graduated diamond pattern.',
					tags: ['choker', 'necklace'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 3,
					overrides: {
						round_quantity: '40',
						round_price: '180',
						round_total: '7200',
						oval_quantity: '6',
						oval_price: '300',
						oval_total: '1800',
						total_cost: '16650',
					},
				},
				{
					SKU: 'NEC-LAR-013',
					name: 'Y-Shaped Lariat Necklace',
					segment: 'Fashion',
					category: 'necklace',
					subCategory: 'Lariat Necklaces',
					description: 'Modern lariat with pear-drop terminus.',
					tags: ['lariat', 'necklace'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 4,
					overrides: {
						pear_quantity: '1',
						pear_price: '1500',
						pear_total: '1500',
						round_quantity: '12',
						round_price: '80',
						round_total: '960',
						total_cost: '8110',
					},
				},
				{
					SKU: 'NEC-STM-014',
					name: 'Statement Diamond Collar',
					segment: 'Couture',
					category: 'necklace',
					subCategory: 'Statement Necklaces',
					description: 'Couture collar with mixed-shape diamonds.',
					tags: ['statement', 'necklace', 'couture'],
					image_URL: ['/Wedding-rings.jpg'],
					stock_qty: 2,
					overrides: {
						round_quantity: '60',
						round_price: '160',
						round_total: '9600',
						emerald_quantity: '4',
						emerald_price: '450',
						emerald_total: '1800',
						marquise_quantity: '8',
						marquise_price: '250',
						marquise_total: '2000',
						total_cost: '19050',
					},
				},
				{
					SKU: 'EAR-CHND-015',
					name: 'Chandelier Diamond Earrings',
					segment: 'Bridal',
					category: 'necklace',
					subCategory: 'Chandelier Earrings',
					description: 'Tiered chandelier earrings with brilliant accents.',
					tags: ['chandelier', 'earring'],
					image_URL: ['/Wedding-rings.jpg'],
					stock_qty: 3,
					overrides: {
						round_quantity: '48',
						round_price: '80',
						round_total: '3840',
						pear_quantity: '4',
						pear_price: '300',
						pear_total: '1200',
						total_cost: '10690',
					},
				},
				{
					SKU: 'BRC-CUFF-016',
					name: 'Open Cuff Bracelet',
					segment: 'Fashion',
					category: 'bracelet',
					subCategory: 'Cuff Bracelets',
					description: 'Sculptural open cuff in 14K rose gold with diamond tips.',
					tags: ['cuff', 'rose gold', 'bracelet'],
					image_URL: ['/ring2.jpg'],
					stock_qty: 5,
					overrides: {
						round_quantity: '14',
						round_price: '100',
						round_total: '1400',
						total_cost: '7050',
					},
				},
			]

			products = await db
				.insert(productsTable)
				.values(
					productSeeds.map((p) => ({
						SKU: p.SKU,
						name: p.name,
						segment: p.segment,
						category: p.category,
						subCategory: p.subCategory,
						description: p.description,
						tags: p.tags,
						image_URL: p.image_URL,
						stock_qty: p.stock_qty,
						...baseDiamondCols,
						...p.overrides,
					}))
				)
				.returning()
			console.log(`✅ Seeded productsTable (${products.length} products)`)
		} else {
			console.log('ℹ️ productsTable already has data, skipping.')
		}

		// =========================
		// DIAMONDS TABLE SEEDING
		// =========================
		let diamonds = await db.select().from(diamondsTable)
		if (diamonds.length === 0) {
			const diamondSeeds = [
				{ SKU: 'DIA-RND-001', name: 'Brilliant Round 0.5ct',  size: '0.5', shape: 'round',    cut: 'regular', color: 'D', clarity: 'IF',   price: '950',  stock_qty: 20, description: 'Flawless brilliant round, ideal cut.' },
				{ SKU: 'DIA-RND-002', name: 'Brilliant Round 1ct',    size: '1',   shape: 'round',    cut: 'best',    color: 'E', clarity: 'VVS1', price: '4200', stock_qty: 15, description: 'Top-quality 1ct round brilliant.' },
				{ SKU: 'DIA-RND-003', name: 'Brilliant Round 1.5ct',  size: '1.5', shape: 'round',    cut: 'premium', color: 'D', clarity: 'IF',   price: '8800', stock_qty: 8,  description: 'Premium 1.5ct round, museum grade.' },
				{ SKU: 'DIA-PRN-004', name: 'Princess Cut 1ct',       size: '1',   shape: 'princess', cut: 'best',    color: 'F', clarity: 'VS1',  price: '3600', stock_qty: 12, description: 'Sharp princess-cut with strong fire.' },
				{ SKU: 'DIA-PRN-005', name: 'Princess Cut 2ct',       size: '2',   shape: 'princess', cut: 'premium', color: 'E', clarity: 'VVS2', price: '11000',stock_qty: 5,  description: 'Premium 2ct princess centerpiece.' },
				{ SKU: 'DIA-EMR-006', name: 'Emerald Cut 1ct',        size: '1',   shape: 'emerald',  cut: 'best',    color: 'G', clarity: 'VS2',  price: '3200', stock_qty: 10, description: 'Hall-of-mirrors emerald cut.' },
				{ SKU: 'DIA-EMR-007', name: 'Emerald Cut 2.5ct',      size: '2.5', shape: 'emerald',  cut: 'premium', color: 'D', clarity: 'VVS1', price: '15600',stock_qty: 3,  description: 'Long emerald with exquisite clarity.' },
				{ SKU: 'DIA-ASC-008', name: 'Asscher Cut 1ct',        size: '1',   shape: 'asscher',  cut: 'regular', color: 'H', clarity: 'SI1',  price: '2500', stock_qty: 9,  description: 'Square asscher with vintage charm.' },
				{ SKU: 'DIA-OVL-009', name: 'Oval Cut 1ct',           size: '1',   shape: 'oval',     cut: 'best',    color: 'E', clarity: 'VS1',  price: '3800', stock_qty: 11, description: 'Elongated oval with strong brilliance.' },
				{ SKU: 'DIA-OVL-010', name: 'Oval Cut 3ct',           size: '3',   shape: 'oval',     cut: 'premium', color: 'D', clarity: 'IF',   price: '21000',stock_qty: 2,  description: 'Statement 3ct oval, top color and clarity.' },
				{ SKU: 'DIA-PER-011', name: 'Pear Cut 1ct',           size: '1',   shape: 'pear',     cut: 'best',    color: 'F', clarity: 'VS1',  price: '3500', stock_qty: 10, description: 'Symmetrical pear with sharp tip.' },
				{ SKU: 'DIA-MRQ-012', name: 'Marquise Cut 1.5ct',     size: '1.5', shape: 'marquise', cut: 'best',    color: 'E', clarity: 'VS2',  price: '5200', stock_qty: 6,  description: 'Classic marquise with bow-tie minimized.' },
				{ SKU: 'DIA-RAD-013', name: 'Radiant Cut 1ct',        size: '1',   shape: 'radiant',  cut: 'best',    color: 'F', clarity: 'VS1',  price: '3400', stock_qty: 9,  description: 'Hybrid radiant — princess meets emerald.' },
				{ SKU: 'DIA-CSH-014', name: 'Cushion Cut 1.5ct',      size: '1.5', shape: 'cushion',  cut: 'premium', color: 'D', clarity: 'VVS2', price: '7600', stock_qty: 7,  description: 'Pillow-soft cushion with crushed-ice facets.' },
				{ SKU: 'DIA-HRT-015', name: 'Heart Cut 1ct',          size: '1',   shape: 'heart',    cut: 'best',    color: 'E', clarity: 'VS1',  price: '3900', stock_qty: 5,  description: 'Symmetric heart, romantic statement.' },
				{ SKU: 'DIA-RND-016', name: 'Brilliant Round 0.5ct G',size: '0.5', shape: 'round',    cut: 'regular', color: 'G', clarity: 'VS2',  price: '700',  stock_qty: 25, description: 'Everyday round brilliant, great value.' },
				{ SKU: 'DIA-RND-017', name: 'Brilliant Round 4ct',    size: '4',   shape: 'round',    cut: 'premium', color: 'D', clarity: 'IF',   price: '48000',stock_qty: 1,  description: 'Exceptional 4ct round, investment grade.' },
				{ SKU: 'DIA-PRN-018', name: 'Princess Cut 3.5ct',     size: '3.5', shape: 'princess', cut: 'premium', color: 'E', clarity: 'VVS1', price: '28500',stock_qty: 2,  description: 'Major-statement 3.5ct princess.' },
			]
			diamonds = await db.insert(diamondsTable).values(diamondSeeds).returning()
			console.log(`✅ Seeded diamondsTable (${diamonds.length} diamonds)`)
		} else {
			console.log('ℹ️ diamondsTable already has data, skipping.')
		}

		// =========================
		// RING STYLES TABLE SEEDING
		// =========================
		let ringStyles = await db.select().from(ringStylesTable)
		if (ringStyles.length === 0) {
			const ringStyleSeeds = [
				{ SKU: 'RS-001', name: 'Classic Solitaire — 14K White',  description: 'Timeless four-prong solitaire in 14K white gold.',  head_style: 'Four Prong',         head_style_price: '200', head_metal: '14K White Gold',  head_metal_price: '300', shank_style: 'Solitaire',           shank_style_price: '150', shank_metal: '14K White Gold',  shank_metal_price: '250', stock_qty: 15 },
				{ SKU: 'RS-002', name: 'Six-Prong Solitaire — 18K Yellow', description: 'Six-prong head on a classic solitaire band.',     head_style: 'Six Prong',          head_style_price: '220', head_metal: '18K Yellow Gold', head_metal_price: '380', shank_style: 'Solitaire',           shank_style_price: '160', shank_metal: '18K Yellow Gold', shank_metal_price: '320', stock_qty: 10 },
				{ SKU: 'RS-003', name: 'French Pave Halo — Platinum',    description: 'French pave halo head on platinum knife-edge.',    head_style: 'French Pave Halo',   head_style_price: '480', head_metal: 'Platinum',        head_metal_price: '650', shank_style: 'Knife Edge Pave',     shank_style_price: '420', shank_metal: 'Platinum',        shank_metal_price: '700', stock_qty: 6  },
				{ SKU: 'RS-004', name: 'Pave Halo Cathedral — 18K White', description: 'Pave halo head set in a cathedral pave band.',    head_style: 'Pave Halo',          head_style_price: '420', head_metal: '18K White Gold',  head_metal_price: '410', shank_style: 'Cathedral Pave',      shank_style_price: '380', shank_metal: '18K White Gold',  shank_metal_price: '400', stock_qty: 8  },
				{ SKU: 'RS-005', name: 'Tulip Basket Rope — 14K Rose',   description: 'Tulip basket head with twisted rope solitaire.',   head_style: 'Tulip Basket',       head_style_price: '300', head_metal: '14K Rose Gold',   head_metal_price: '280', shank_style: 'Rope Solitaire',      shank_style_price: '210', shank_metal: '14K Rose Gold',   shank_metal_price: '260', stock_qty: 7  },
				{ SKU: 'RS-006', name: 'Vintage Basket U-Pave — 18K Rose', description: 'Vintage basket head over a U-shaped pave band.',head_style: 'Vintage Basket',     head_style_price: '350', head_metal: '18K Rose Gold',   head_metal_price: '360', shank_style: 'U Shaped Pave',       shank_style_price: '290', shank_metal: '18K Rose Gold',   shank_metal_price: '340', stock_qty: 5  },
				{ SKU: 'RS-007', name: 'Classic Basket Channel — 14K Yellow', description: 'Classic basket with channel-set diamonds.',  head_style: 'Classic Basket',     head_style_price: '260', head_metal: '14K Yellow Gold', head_metal_price: '290', shank_style: 'Channel Set',         shank_style_price: '310', shank_metal: '14K Yellow Gold', shank_metal_price: '270', stock_qty: 9  },
				{ SKU: 'RS-008', name: 'Sapphire Halo Sleek — 18K White', description: 'Sapphire halo head on a sleek accent band.',     head_style: 'Sapphire Halo',      head_style_price: '460', head_metal: '18K White Gold',  head_metal_price: '410', shank_style: 'Sleek Accent',        shank_style_price: '230', shank_metal: '18K White Gold',  shank_metal_price: '400', stock_qty: 4  },
				{ SKU: 'RS-009', name: 'Falling Edge Halo Knife — Platinum', description: 'Falling-edge halo with knife-edge solitaire.', head_style: 'Falling Edge Halo',  head_style_price: '500', head_metal: 'Platinum',        head_metal_price: '650', shank_style: 'Knife Edge Solitaire',shank_style_price: '260', shank_metal: 'Platinum',        shank_metal_price: '700', stock_qty: 3  },
				{ SKU: 'RS-010', name: 'Scalloped Six Prong Rope Pave — 14K White', description: 'Scalloped six-prong on a rope-pave band.', head_style: 'Scalloped Six Prong',head_style_price: '280', head_metal: '14K White Gold',  head_metal_price: '300', shank_style: 'Rope Pave',           shank_style_price: '320', shank_metal: '14K White Gold',  shank_metal_price: '250', stock_qty: 8  },
				{ SKU: 'RS-011', name: 'Pave Basket Marquise Diamond — 18K Yellow', description: 'Pave basket head on marquise diamond shank.', head_style: 'Pave Basket',  head_style_price: '320', head_metal: '18K Yellow Gold', head_metal_price: '380', shank_style: 'Marquise Diamond',    shank_style_price: '300', shank_metal: '18K Yellow Gold', shank_metal_price: '320', stock_qty: 6  },
				{ SKU: 'RS-012', name: 'Lotus Basket Marquise Sapphire — 14K Rose', description: 'Lotus basket head with marquise sapphire accents.', head_style: 'Lotus Basket', head_style_price: '340', head_metal: '14K Rose Gold',  head_metal_price: '280', shank_style: 'Marquise Saphire',    shank_style_price: '290', shank_metal: '14K Rose Gold',   shank_metal_price: '260', stock_qty: 5  },
				{ SKU: 'RS-013', name: 'Surprise Diamond French Pave — 18K White', description: 'Surprise side-diamond head with French pave band.', head_style: 'Surprise Diamond', head_style_price: '360', head_metal: '18K White Gold', head_metal_price: '410', shank_style: 'French Pave',         shank_style_price: '270', shank_metal: '18K White Gold',  shank_metal_price: '400', stock_qty: 4  },
				{ SKU: 'RS-014', name: 'Surprise Sapphire Knife Edge Pave — Platinum', description: 'Surprise sapphire head on knife-edge pave band.', head_style: 'Surprise Sapphire', head_style_price: '380', head_metal: 'Platinum',     head_metal_price: '650', shank_style: 'Knife Edge Pave',     shank_style_price: '420', shank_metal: 'Platinum',        shank_metal_price: '700', stock_qty: 3  },
				{ SKU: 'RS-015', name: 'Four Prong French Pave — 14K Yellow', description: 'Four-prong head on a French pave band.',     head_style: 'Four Prong',         head_style_price: '200', head_metal: '14K Yellow Gold', head_metal_price: '290', shank_style: 'French Pave',         shank_style_price: '270', shank_metal: '14K Yellow Gold', shank_metal_price: '270', stock_qty: 10 },
				{ SKU: 'RS-016', name: 'Six Prong Cathedral Pave — 18K Rose', description: 'Six prongs above a cathedral pave shank.',   head_style: 'Six Prong',          head_style_price: '220', head_metal: '18K Rose Gold',   head_metal_price: '360', shank_style: 'Cathedral Pave',      shank_style_price: '380', shank_metal: '18K Rose Gold',   shank_metal_price: '340', stock_qty: 5  },
			]
			ringStyles = await db
				.insert(ringStylesTable)
				.values(
					ringStyleSeeds.map((rs) => ({
						...rs,
						image_URL: ['/ring2.jpg', '/Wedding-rings.jpg'],
					}))
				)
				.returning()
			console.log(`✅ Seeded ringStylesTable (${ringStyles.length} ring styles)`)
		} else {
			console.log('ℹ️ ringStylesTable already has data, skipping.')
		}

		// =========================
		// ADDRESSES TABLE SEEDING (user-saved addresses, no order_id)
		// =========================
		const existingAddresses = await db.select().from(addressesTable).limit(1)
		if (existingAddresses.length === 0 && users.length >= 4) {
			await db.insert(addressesTable).values([
				{
					user_id: users[0].user_id,
					full_name: users[0].name,
					phone_number: '+919876543210',
					address_line1: '12 Marine Drive',
					address_line2: 'Apt 5B',
					city: 'Mumbai',
					state: 'Maharashtra',
					country: 'India',
					pincode: '400020',
					is_billing: true,
					is_shipping: true,
				},
				{
					user_id: users[1].user_id,
					full_name: users[1].name,
					phone_number: '+919812345678',
					address_line1: '88 MG Road',
					city: 'Bengaluru',
					state: 'Karnataka',
					country: 'India',
					pincode: '560001',
					is_billing: true,
					is_shipping: true,
				},
				{
					user_id: users[2].user_id,
					full_name: users[2].name,
					phone_number: '+919900112233',
					address_line1: '21 Park Street',
					address_line2: 'Floor 3',
					city: 'Kolkata',
					state: 'West Bengal',
					country: 'India',
					pincode: '700016',
					is_billing: false,
					is_shipping: true,
				},
				{
					user_id: users[3].user_id,
					full_name: users[3].name,
					phone_number: '+919871122334',
					address_line1: '45 Anna Salai',
					city: 'Chennai',
					state: 'Tamil Nadu',
					country: 'India',
					pincode: '600002',
					is_billing: true,
					is_shipping: true,
				},
				{
					user_id: users[0].user_id,
					full_name: users[0].name,
					phone_number: '+919876543210',
					address_line1: '7 Connaught Place',
					city: 'New Delhi',
					state: 'Delhi',
					country: 'India',
					pincode: '110001',
					is_billing: false,
					is_shipping: true,
				},
			])
			console.log('✅ Seeded addressesTable (user-saved addresses)')
		} else if (existingAddresses.length > 0) {
			console.log('ℹ️ addressesTable already has data, skipping.')
		}

		// =========================
		// ORDERS + ORDER ITEMS + TRANSACTIONS + ORDER-LINKED ADDRESSES
		// =========================
		const existingOrders = await db.select().from(ordersTable).limit(1)
		if (
			existingOrders.length === 0 &&
			users.length >= 3 &&
			products.length >= 3 &&
			diamonds.length >= 3 &&
			ringStyles.length >= 3
		) {
			const guestId = randomUUID()

			const orderRows = [
				{ user_id: users[0].user_id, guest_id: null, total_amount: 14250, status: 'delivered' },
				{ user_id: users[1].user_id, guest_id: null, total_amount: 9800,  status: 'shipped'   },
				{ user_id: users[2].user_id, guest_id: null, total_amount: 21500, status: 'paid'      },
				{ user_id: null,             guest_id: guestId, total_amount: 6450, status: 'pending' },
			]
			const orders = await db.insert(ordersTable).values(orderRows).returning()
			console.log(`✅ Seeded ordersTable (${orders.length} orders)`)

			const orderItems = [
				{
					order_id: orders[0].order_id,
					product_id: products[0].product_id,
					product_cost: '6550',
					ring_size: '6',
					quantity: 1,
				},
				{
					order_id: orders[0].order_id,
					diamond_id: diamonds[1].diamond_id,
					ring_style_id: ringStyles[0].ring_style_id,
					diamond_cost: diamonds[1].price,
					ring_cost: '900',
					ring_size: '7',
					quantity: 1,
				},
				{
					order_id: orders[1].order_id,
					product_id: products[2].product_id,
					product_cost: '9610',
					ring_size: '6.5',
					quantity: 1,
				},
				{
					order_id: orders[2].order_id,
					diamond_id: diamonds[9].diamond_id,
					ring_style_id: ringStyles[2].ring_style_id,
					diamond_cost: diamonds[9].price,
					ring_cost: '2250',
					ring_size: '5.5',
					quantity: 1,
				},
				{
					order_id: orders[2].order_id,
					product_id: products[10].product_id,
					product_cost: '8150',
					quantity: 1,
				},
				{
					order_id: orders[3].order_id,
					product_id: products[3].product_id,
					product_cost: '6450',
					ring_size: '8',
					quantity: 1,
				},
			]
			await db.insert(orderItemsTable).values(orderItems)
			console.log(`✅ Seeded orderItemsTable (${orderItems.length} items)`)

			await db.insert(transactionsTable).values([
				{
					order_id: orders[0].order_id,
					user_id: users[0].user_id,
					payment_method: 'creditCard',
					payment_status: 'success',
					transaction_amount: 14250,
					transaction_reference: 'TXN_' + randomUUID(),
				},
				{
					order_id: orders[1].order_id,
					user_id: users[1].user_id,
					payment_method: 'upi',
					payment_status: 'success',
					transaction_amount: 9800,
					transaction_reference: 'TXN_' + randomUUID(),
				},
				{
					order_id: orders[2].order_id,
					user_id: users[2].user_id,
					payment_method: 'creditCard',
					payment_status: 'success',
					transaction_amount: 21500,
					transaction_reference: 'TXN_' + randomUUID(),
				},
				{
					order_id: orders[3].order_id,
					user_id: null,
					payment_method: 'upi',
					payment_status: 'pending',
					transaction_amount: 6450,
					transaction_reference: 'TXN_' + randomUUID(),
				},
			])
			console.log('✅ Seeded transactionsTable')

			// Order-snapshot shipping addresses
			await db.insert(addressesTable).values([
				{
					user_id: users[0].user_id,
					order_id: orders[0].order_id,
					full_name: users[0].name,
					phone_number: '+919876543210',
					address_line1: '12 Marine Drive',
					address_line2: 'Apt 5B',
					city: 'Mumbai',
					state: 'Maharashtra',
					country: 'India',
					pincode: '400020',
					is_billing: true,
					is_shipping: true,
				},
				{
					user_id: users[1].user_id,
					order_id: orders[1].order_id,
					full_name: users[1].name,
					phone_number: '+919812345678',
					address_line1: '88 MG Road',
					city: 'Bengaluru',
					state: 'Karnataka',
					country: 'India',
					pincode: '560001',
					is_shipping: true,
				},
				{
					user_id: users[2].user_id,
					order_id: orders[2].order_id,
					full_name: users[2].name,
					phone_number: '+919900112233',
					address_line1: '21 Park Street',
					address_line2: 'Floor 3',
					city: 'Kolkata',
					state: 'West Bengal',
					country: 'India',
					pincode: '700016',
					is_shipping: true,
				},
				{
					guest_id: guestId,
					order_id: orders[3].order_id,
					full_name: 'Guest Buyer',
					phone_number: '+919000000000',
					address_line1: '9 Sector 21',
					city: 'Gurugram',
					state: 'Haryana',
					country: 'India',
					pincode: '122001',
					is_shipping: true,
				},
			])
			console.log('✅ Seeded order-linked addresses')
		} else if (existingOrders.length > 0) {
			console.log('ℹ️ ordersTable already has data, skipping.')
		}

		// =========================
		// CART TABLE SEEDING
		// =========================
		const existingCart = await db.select().from(cartTable).limit(1)
		if (
			existingCart.length === 0 &&
			users.length >= 3 &&
			products.length >= 3 &&
			diamonds.length >= 3 &&
			ringStyles.length >= 3
		) {
			const guestId = randomUUID()
			await db.insert(cartTable).values([
				{
					user_id: users[0].user_id,
					product_id: products[4].product_id,
					ring_size: '6',
					quantity: 1,
				},
				{
					user_id: users[0].user_id,
					diamond_id: diamonds[2].diamond_id,
					ring_style_id: ringStyles[3].ring_style_id,
					ring_size: '7',
					quantity: 1,
				},
				{
					user_id: users[1].user_id,
					product_id: products[7].product_id,
					quantity: 1,
				},
				{
					user_id: users[2].user_id,
					product_id: products[1].product_id,
					ring_size: '6.5',
					quantity: 1,
				},
				{
					user_id: users[2].user_id,
					diamond_id: diamonds[5].diamond_id,
					ring_style_id: ringStyles[5].ring_style_id,
					ring_size: '5',
					quantity: 1,
				},
				{
					user_id: users[3].user_id,
					product_id: products[11].product_id,
					quantity: 2,
				},
				{
					guest_id: guestId,
					product_id: products[8].product_id,
					quantity: 1,
				},
				{
					guest_id: guestId,
					diamond_id: diamonds[0].diamond_id,
					ring_style_id: ringStyles[1].ring_style_id,
					ring_size: '8',
					quantity: 1,
				},
			])
			console.log('✅ Seeded cartTable')
		} else if (existingCart.length > 0) {
			console.log('ℹ️ cartTable already has data, skipping.')
		}

		// =========================
		// FAVORITES TABLE SEEDING
		// =========================
		const existingFavorites = await db.select().from(favoritesTable).limit(1)
		if (
			existingFavorites.length === 0 &&
			users.length >= 3 &&
			products.length >= 3 &&
			diamonds.length >= 3 &&
			ringStyles.length >= 3
		) {
			await db.insert(favoritesTable).values([
				{ user_id: users[0].user_id, product_id: products[0].product_id },
				{ user_id: users[0].user_id, product_id: products[2].product_id },
				{ user_id: users[0].user_id, diamond_id: diamonds[3].diamond_id },
				{ user_id: users[0].user_id, ring_style_id: ringStyles[2].ring_style_id },
				{ user_id: users[1].user_id, product_id: products[5].product_id },
				{ user_id: users[1].user_id, product_id: products[10].product_id },
				{ user_id: users[1].user_id, diamond_id: diamonds[6].diamond_id },
				{ user_id: users[2].user_id, ring_style_id: ringStyles[4].ring_style_id },
				{ user_id: users[2].user_id, product_id: products[13].product_id },
				{ user_id: users[3].user_id, product_id: products[7].product_id },
				{ user_id: users[3].user_id, diamond_id: diamonds[9].diamond_id },
				{ user_id: users[3].user_id, ring_style_id: ringStyles[0].ring_style_id },
			])
			console.log('✅ Seeded favoritesTable')
		} else if (existingFavorites.length > 0) {
			console.log('ℹ️ favoritesTable already has data, skipping.')
		}

		// =========================
		// REVIEWS TABLE SEEDING
		// =========================
		const existingReviews = await db.select().from(reviewsTable).limit(1)
		if (
			existingReviews.length === 0 &&
			users.length >= 3 &&
			products.length >= 3 &&
			diamonds.length >= 3 &&
			ringStyles.length >= 3
		) {
			await db.insert(reviewsTable).values([
				{
					user_id: users[0].user_id,
					product_id: products[0].product_id,
					rating: 5,
					comment: 'Absolutely stunning, exceeded my expectations!',
					image_URL: [],
				},
				{
					user_id: users[0].user_id,
					diamond_id: diamonds[1].diamond_id,
					rating: 5,
					comment: 'The brilliance is unreal — perfect for our engagement.',
					image_URL: [],
				},
				{
					user_id: users[1].user_id,
					product_id: products[2].product_id,
					rating: 4,
					comment: 'Beautiful eternity band, sizing was slightly off but support fixed it.',
					image_URL: [],
				},
				{
					user_id: users[1].user_id,
					ring_style_id: ringStyles[2].ring_style_id,
					rating: 5,
					comment: 'Halo head with platinum knife edge looks incredible.',
					image_URL: [],
				},
				{
					user_id: users[2].user_id,
					product_id: products[10].product_id,
					rating: 5,
					comment: 'Pendant arrived beautifully boxed. Highly recommend.',
					image_URL: [],
				},
				{
					user_id: users[2].user_id,
					diamond_id: diamonds[9].diamond_id,
					rating: 4,
					comment: 'Massive 3ct oval — exactly what we wanted.',
					image_URL: [],
				},
				{
					user_id: users[3].user_id,
					product_id: products[7].product_id,
					rating: 5,
					comment: 'Tennis bracelet sparkles from every angle.',
					image_URL: [],
				},
				{
					user_id: users[3].user_id,
					ring_style_id: ringStyles[5].ring_style_id,
					rating: 4,
					comment: 'Lovely vintage feel, rose gold pairs nicely with the stone.',
					image_URL: [],
				},
			])
			console.log('✅ Seeded reviewsTable')
		} else if (existingReviews.length > 0) {
			console.log('ℹ️ reviewsTable already has data, skipping.')
		}

		console.log('🎉 Seeding completed successfully!')
		process.exit(0)
	} catch (error) {
		console.error('❌ Seeding failed:', error)
		process.exit(1)
	}
}

seed()
