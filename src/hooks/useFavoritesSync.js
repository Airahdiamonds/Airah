import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	addToFavorites,
	addToFavoritesLocal,
	clearLocalFavorites,
	fetchUserFavorites,
} from '../redux/favoritesCartSlice'

const readLocalFavorites = () => JSON.parse(localStorage.getItem('favorites')) || []

export const useFavoritesSync = () => {
	const dispatch = useDispatch()
	const { currentUser } = useSelector((state) => state.localization)

	useEffect(() => {
		const localFavorites = readLocalFavorites()

		if (!currentUser) {
			localFavorites.forEach((favorite) => {
				dispatch(addToFavoritesLocal(favorite))
			})
			return
		}

		localFavorites.forEach((favorite) => {
			dispatch(
				addToFavorites({
					currentUser,
					product_id: favorite.product_id,
					diamond_id: favorite.diamond_id,
					ring_style_id: favorite.ring_style_id,
				})
			)
		})
		dispatch(clearLocalFavorites())
		dispatch(fetchUserFavorites(currentUser))
	}, [currentUser, dispatch])

	return { currentUser }
}

export default useFavoritesSync
