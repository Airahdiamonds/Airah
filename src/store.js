import { configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import { combineReducers } from 'redux'
import localizationReducer from './redux/localizationSlice'
import ringCustomizationReducer from './redux/ringCustomizationSlice'
import favoritesCartReducer from './redux/favoritesCartSlice'
import userProductsReducer from './redux/userProductsSlice'

const persistConfig = {
	key: 'root',
	storage,
}

const rootReducer = combineReducers({
	ringCustomization: ringCustomizationReducer,
	localization: localizationReducer,
	favoritesCart: favoritesCartReducer,
	userProducts: userProductsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
})

export const persistor = persistStore(store)
