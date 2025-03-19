import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import CustomizeRing from './screens/CustomizeRing'
import Favorites from './screens/Favorites'
import Cart from './screens/Cart'
import ProductGrid from './screens/ProductGrid'
import ProductsList from './screens/Admin/ProductsList'
import AddProduct from './screens/Admin/AddProduct'
import AdminDashboard from './screens/Admin/Dashboard'
import UsersList from './screens/Admin/UsersList'
import Master from './screens/Admin/Master'
import Edu from './screens/Edu'
import AddDiamond from './screens/Admin/AddDiamond'
import AddStyle from './screens/Admin/AddStyle'
import DiamondsList from './screens/Admin/DiamondsList'
import StylesList from './screens/Admin/StylesList'
import Product from './screens/Product'
import SearchGrid from './screens/SearchGrid'
import AdvertisementStrip from './components/addstrip' // Importing Ad Strip
import AddCoupon from './screens/Admin/AddCoupon'

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Header />
				<AdvertisementStrip /> {/* Adding the Advertisement Strip */}
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/customize" element={<CustomizeRing />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/cart" element={<Cart />} />
					<Route path="/Product" element={<ProductGrid />} />
					<Route path="/dashboard" element={<AdminDashboard />} />
					<Route path="/addProducts" element={<AddProduct />} />
					<Route path="/productsList" element={<ProductsList />} />
					<Route path="/userList" element={<UsersList />} />
					<Route path="/master" element={<Master />} />
					<Route path="/products/:id" element={<Product />} />
					<Route path="/Edu" element={<Edu />} />
					<Route path="/addDiamonds" element={<AddDiamond />} />
					<Route path="/addStyles" element={<AddStyle />} />
					<Route path="/diamondsList" element={<DiamondsList />} />
					<Route path="/stylesList" element={<StylesList />} />
					<Route path="/search" element={<SearchGrid />} />
					<Route path="/addCoupon" element={<AddCoupon />} />
				</Routes>
				<Footer />
			</PersistGate>
		</Provider>
	)
}

export default App
