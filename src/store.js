import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from 'redux'
import localizationReducer from './redux/localizationSlice'
import ringCustomizationReducer from './redux/ringCustomizationSlice'
import favoritesCartReducer from './redux/favoritesCartSlice'
import userProductsReducer from './redux/userProductsSlice'
import ordersReducer from './redux/ordersSlice'

const persistConfig = {
	key: 'root',
	storage,
}

const rootReducer = combineReducers({
	ringCustomization: ringCustomizationReducer,
	localization: localizationReducer,
	favoritesCart: favoritesCartReducer,
	userProducts: userProductsReducer,
	orders: ordersReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
})

export const persistor = persistStore(store)
