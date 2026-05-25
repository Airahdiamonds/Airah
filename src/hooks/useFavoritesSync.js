import { useSelector } from 'react-redux'

// Convenience hook for grids/screens that need the current identity
// (user or guest) when dispatching favorites thunks. Favorites are
// server-backed for both — there's no longer a local-only fallback
// to merge here. Bootstrap of the favorites list happens in Header.
export const useFavoritesSync = () => {
	const { currentUser, guestUser } = useSelector((state) => state.localization)
	return { currentUser, guestUser }
}

export default useFavoritesSync
