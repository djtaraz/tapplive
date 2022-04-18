import { createSlice } from '@reduxjs/toolkit'
import { goalStatus, streamStatus } from '../../common/entities/stream'

export const initialState = {
    stream: null,
    streams: null,
    selectedStreams: null,
    goals: [],
    goalsLoading: true,
    currentGoal: null,
    isSidebarCollapsed: false,
    isGoalsEnough: false,
    needToUpdateMultiscreens: false,
}
const streamSlice = createSlice({
    name: 'stream-details',
    initialState,
    reducers: {
        resetStorage(state) {
            state = initialState
        },
        toggleSidebar(state) {
            state.isSidebarCollapsed = !state.isSidebarCollapsed
        },
        resetCurrentStream(state) {
            state.goals = initialState.goals
            state.goalsLoading = initialState.goalsLoading
            state.currentGoal = initialState.currentGoal
            state.isGoalsEnough = initialState.isGoalsEnough
        },
        setStream(state, { payload }) {
            state.stream = payload
        },
        setStreams(state, { payload }) {
            if (!state.needToUpdateMultiscreens) {
                state.goals = initialState.goals
                state.goalsLoading = initialState.goalsLoading
                state.currentGoal = initialState.currentGoal
                state.isGoalsEnough = initialState.isGoalsEnough
            }
            state.streams = state.streams
                ? state.streams.map((item) => {
                      const currentItem = payload.find((newItem) => newItem._id === item._id)
                      return { ...item, ...currentItem }
                  })
                : payload
            state.stream = state.streams[0]
        },
        updateStream(state, { payload }) {
            const { currentGoal, ...update } = payload
            if (
                [streamStatus.suspended, streamStatus.live].includes(state.stream.status) &&
                update?.status === streamStatus.closed
            ) {
                state.stream.closeStream = true
                state.stream.endDate = update.endDate || new Date()
            }
            const currentInPending = state.goals
                .map((item) => item.status)
                .filter((status) => status === goalStatus.pending).length
            if (currentInPending !== payload.pendingGoalCount) {
                state.isGoalsEnough = false
            }

            state.currentGoal = currentGoal
            state.stream = {
                ...state.stream,
                ...update,
            }
        },
        updateMultiscreen(state, { payload }) {
            const { currentGoal, ...update } = payload
            const streamId = update._id

            let shouldBeClosed = false
            if (
                [streamStatus.suspended, streamStatus.live].includes(state.stream.status) &&
                update?.status === streamStatus.closed
            ) {
                shouldBeClosed = true
            }
            const elementIndex = state.streams.findIndex((item) => item._id === streamId)

            state.streams[elementIndex] = {
                ...state.streams[elementIndex],
                ...update,
                closeStream: shouldBeClosed,
                endDate: shouldBeClosed ? update.endDate || new Date() : undefined,
            }

            // then update stream field

            if (state.stream._id === streamId) {
                state.stream = {
                    ...state.stream,
                    ...state.streams[elementIndex],
                }
            }

            // then current goals

            const currentInPending = state.goals
                .map((item) => item.status)
                .filter((status) => status === goalStatus.pending).length
            if (currentInPending !== payload.pendingGoalCount) {
                state.isGoalsEnough = false
            }
            state.currentGoal = currentGoal
        },
        setGoals(state, { payload }) {
            const firstGoal = payload[0]
            if (firstGoal?.status === goalStatus.inProgress) {
                state.goals = payload.slice(1)
                state.currentGoal = firstGoal
            } else {
                state.goals = payload
            }
            state.isGoalsEnough = true

            state.goalsLoading = false
        },
        removeGoal(state, { payload }) {
            if (payload === state.currentGoal?._id) {
                state.currentGoal = null
            }
            state.goals = state.goals.filter((goal) => goal._id !== payload)
        },
        acceptGoal(state, { payload }) {
            state.goals = state.goals.map((goal) =>
                goal._id === payload
                    ? {
                          ...goal,
                          status: goalStatus.accepted,
                      }
                    : goal,
            )
        },
        backGoal(state, { payload }) {
            const { _id, amount } = payload
            state.goals = state.goals.map((goal) =>
                goal._id === _id
                    ? {
                          ...goal,
                          currentAmount: goal.currentAmount + amount,
                      }
                    : goal,
            )
        },
    },
})

export const {
    setStream,
    setGoals,
    removeGoal,
    acceptGoal,
    backGoal,
    toggleSidebar,
    updateStream,
    setStreams,
    updateMultiscreen,
    resetCurrentStream,
    resetStorage,
} = streamSlice.actions
export default streamSlice.reducer
