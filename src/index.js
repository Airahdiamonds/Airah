import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'

const clerkFrontendApi = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY

if (!clerkFrontendApi) {
	console.error('Error: Missing Clerk publishable key!')
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<ClerkProvider publishableKey={clerkFrontendApi}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ClerkProvider>
)
