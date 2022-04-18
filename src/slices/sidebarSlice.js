import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        streams: [],
        following: [],
    },
    reducers: {
        setFollowing: (state, action) => {
            state.following = action.payload
        },

        setStreams: (state, action) => {
            state.streams = action.payload
        },
    },
})

export const { setStreams, setFollowing } = sidebarSlice.actions

export default sidebarSlice.reducer
