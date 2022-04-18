import { createSlice } from '@reduxjs/toolkit'

const rootSlice = createSlice({
    name: 'root',
    initialState: {
        isAuthenticated: localStorage.getItem('sessionId') ? true : false,
        me: null,
        screen: null,
        error: null,
        isModalOpened: false,
        warningModalState: {
            isOpened: false,
            content: '',
        },
        isFooterVisible: true,
    },
    reducers: {
        setScreen: (state, action) => {
            state.screen = action.payload
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        setModalState: (state, action) => {
            state.isModalOpened = action.payload
        },
        setWarningModalState: (state, action) => {
            state.warningModalState = action.payload
        },
        setMe: (state, action) => {
            state.me = action.payload
        },
        setError: (state, { payload }) => {
            state.error = payload
                ? {
                      message: payload.message || payload.error.message,
                      instance: payload.error,
                      id: payload.id ? payload.id : undefined,
                  }
                : null
        },

        logout: (state) => {
            localStorage.clear()

            state.isAuthenticated = false
            state.isModalOpened = true
            state.me = null
        },
        setFooterVisibility: (state, { payload }) => {
            state.isFooterVisible = payload
        },
    },
})

export const {
    setIsAuthenticated,
    setMe,
    setScreen,
    setError,
    setModalState,
    setWarningModalState,
    logout,
    setFooterVisibility,
} = rootSlice.actions
export default rootSlice.reducer
