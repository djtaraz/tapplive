import { createSlice } from '@reduxjs/toolkit'
import { uniqify } from 'utils/arrayUtils'

const initialStateModel = {
    globalSearchTerm: '',
    globalSearchTab: 'streams',

    recentQueries: [],

    recentStreams: [],
    recentPeoples: [],
    recentOrders: [],
    recentTags: [],
    recentPlaces: [],
}

const getDataFromLocalStorage = () => {
    try {
        return {
            ...JSON.parse(localStorage.getItem('recentSearchData')),
            globalSearchTerm: '',
            globalSearchTab: '',
        }
    } catch {
        return initialStateModel
    }
}

const setSearchStateToLocalStorage = (state) => {
    localStorage.setItem('recentSearchData', JSON.stringify(state))
}

const searchSlice = createSlice({
    name: 'search',
    initialState: localStorage.getItem('recentSearchData') ? getDataFromLocalStorage() : initialStateModel,

    reducers: {
        setRecentQueries: (state, action) => {
            state.recentQueries = action.payload
            setSearchStateToLocalStorage(state)
        },

        setRecentStreams: (state, action) => {
            state.recentStreams = uniqify(action.payload, '_id')
            setSearchStateToLocalStorage(state)
        },
        setRecentPeoples: (state, action) => {
            state.recentPeoples = uniqify(action.payload, '_id')
            setSearchStateToLocalStorage(state)
        },
        setRecentOrders: (state, action) => {
            state.recentOrders = uniqify(action.payload, '_id')
            setSearchStateToLocalStorage(state)
        },
        setRecentTags: (state, action) => {
            state.recentTags = uniqify(action.payload, '_id')
            setSearchStateToLocalStorage(state)
        },
        setRecentPlaces: (state, action) => {
            state.recentPlaces = uniqify(action.payload, '_id')
            setSearchStateToLocalStorage(state)
        },

        setGlobalSearchTerm: (state, action) => {
            state.globalSearchTerm = action.payload
        },

        setGlobalSearchTab: (state, action) => {
            state.globalSearchTab = action.payload
        },
    },
})

export const {
    setRecentQueries,
    setRecentStreams,
    setRecentPeoples,
    setRecentOrders,
    setRecentTags,
    setRecentPlaces,
    setGlobalSearchTerm,
    setGlobalSearchTab,
} = searchSlice.actions

export default searchSlice.reducer
