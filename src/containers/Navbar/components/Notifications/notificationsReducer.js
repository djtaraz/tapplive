import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    activities: [],
    haveNewNotifications: false,
    areNotificationsVisible: false,
}
const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setActivities(state, { payload }) {
            state.activities = payload
        },
        pushActivity(state, { payload }) {
            state.activities = [payload, ...state.activities]
        },
        setNewNotifications(state, { payload }) {
            state.haveNewNotifications = payload
        },
        openNotifications(state) {
            state.areNotificationsVisible = true
        },
        closeNotifications(state) {
            state.areNotificationsVisible = false
        },
    },
})

export const {
    setActivities,
    pushActivity,
    setNewNotifications,
    openNotifications,
    closeNotifications,
} = notificationsSlice.actions
export default notificationsSlice.reducer
