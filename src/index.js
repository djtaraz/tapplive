import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './i18n'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import rootReducer from './slices/rootSlice'
import sidebarReducer from 'slices/sidebarSlice'
import chatReducer from 'slices/chatSlice'
import searchReducer from 'slices/searchSlice'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from 'react-query'

const reducer = combineReducers({
    root: rootReducer,
    sidebar: sidebarReducer,
    chat: chatReducer,
    search: searchReducer,
})
export const store = configureStore({
    reducer,
})

const queryClient = new QueryClient()

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
)
