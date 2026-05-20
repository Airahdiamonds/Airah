import { and, eq, sql } from 'drizzle-orm'
import { favoritesTable } from './schema/favorites.js'

// Re-usable building blocks shared across feature files. Each helper is
// scoped to a small, well-defined responsibility so route handlers and
// feature functions don't end up duplicating SQL fragments.

// SQL fragment that sums the four price components of a ring style.
// Pricing math lives here so the cart, favorites view, and checkout
// totals all agree on the same formula.
//
//   ring_style_price: ringStyleTotalPriceSQL(ringStylesTable).as('ring_style_price'),
export const ringStyleTotalPriceSQL = (rs) => sql`
	${rs.head_style_price} +
	${rs.shank_style_price} +
	${rs.head_metal_price} +
	${rs.shank_metal_price}
`

// LEFT JOIN condition that attaches the current user's `favorite_id`
// to a catalog row (product / diamond / ring style). When `userId` is
// falsy the join matches no rows, which is the correct behaviour for
// guests — they shouldn't see anyone's favorites marker.
export const favoritesJoinForUser = (catalogIdColumn, favoriteColumn, userId) =>
	and(
		eq(catalogIdColumn, favoriteColumn),
		userId ? eq(favoritesTable.user_id, userId) : sql`false`
	)
