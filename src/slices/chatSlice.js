import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { putAuth } from '../requests/axiosConfig'
import { listChats } from '../requests/chat-requests'
import { listOnlineUsers } from '../requests/user-requests'
import { listMessages } from '../requests/message-requests'
import { dateFromString } from 'utils/dateUtils'

const sliceName = 'chat'

async function getChats({ chatThreshold, startChat }) {
    const { chats, threshold } = await listChats({ chatThreshold })
    const onlineUsers = await listOnlineUsers()
    const onlineUserIds = onlineUsers.map(({ _id }) => _id)
    let newChat = chats.map((chat) => {
        chat.user.isOnline = onlineUserIds.includes(chat.user._id)
        return chat
    })
    if (startChat !== null && !newChat.map((chat) => chat._id).includes(startChat._id)) {
        newChat = [{ messages: [], ...startChat }, ...newChat]
    }
    return {
        chats: newChat,
        threshold,
    }
}

async function getMessages({ chatId, threshold }) {
    console.log('cslices')
    const messagesResponse = await listMessages({ chatId, threshold })
    return { chatId, ...messagesResponse }
}

export const requestChats = createAsyncThunk(`${sliceName}/requestChats`, getChats)

export const requestChatsByThreshold = createAsyncThunk(`${sliceName}/requestChatsByThreshold`, getChats)

export const requestMessages = createAsyncThunk(`${sliceName}/requestMessages`, getMessages)

export const readChat = createAsyncThunk(`${sliceName}/readChat`, async (chatId) => {
    await putAuth(`chats/${chatId}`)
    return chatId
})
export const receiveMessage = createAsyncThunk(`${sliceName}/receiveMessage`, async (message, { getState }) => {
    const { chat } = getState()
    const isMsgFromCurrentChat = chat.selectedChatId === message.chatId
    if (isMsgFromCurrentChat) {
        await putAuth(`chats/${message.chatId}`)
    }

    return {
        isMsgFromCurrentChat,
        message,
    }
})

const slice = createSlice({
    name: sliceName,
    initialState: {
        chats: [],
        areChatsLoading: true,
        areMessagesLoading: false,
        newChat: null,
        unreadMsgCount: 0,
        selectedChatId: null,
        chatThreshold: null,
        startChat: null,
    },
    reducers: {
        setUserOnlineStatus(state, { payload }) {
            state.chats = state.chats.map((chat) => {
                if (chat.user._id === payload.userId) {
                    chat.user.isOnline = payload.isOnline
                }
                return chat
            })
        },
        selectChat(state, { payload }) {
            state.selectedChatId = payload
        },
        alterChat(state, { payload }) {
            state.chats = state.chats.map((chat) => {
                return chat._id === payload._id ? { ...chat, ...payload } : chat
            })
        },
        alterMessage(state, { payload }) {
            const { id, message } = payload
            state.chats = state.chats.map((chat) => {
                if (chat._id === message.chatId) {
                    chat.messages = chat.messages.map((msg) => {
                        return msg._id === id ? message : msg
                    })
                }
                return chat
            })
        },
        startChat(state, { payload }) {
            // chat doesn't exist
            if (!state.chats.find(({ _id }) => payload._id === _id)) {
                state.chats = [payload, ...state.chats].sort((c1, c2) => {
                    return dateFromString(c2.updateDate) - dateFromString(c1.updateDate)
                })
            }
            state.selectedChatId = payload._id
            state.startChat = payload
        },
        clearChat(state) {
            state.chats = state.chats.filter(({ lastMessage }) => lastMessage != null)
            state.selectedChatId = null
            state.startChat = null
        },
        setUsersOnline(state, { payload }) {
            const onlineUserIds = payload.map(({ _id }) => _id)
            state.chats = state.chats.map((chat) => {
                chat.user.isOnline = onlineUserIds.includes(chat.user._id)
                return chat
            })
        },
        sendMessage(state, { payload }) {
            const chats = state.chats.map((chat) => {
                if (chat._id === payload.chatId) {
                    chat.messages = [...(chat.messages || []).filter((m) => m._id !== payload._id), payload]
                    chat.lastMessage = payload
                    chat.updateDate = payload.createDate
                }
                return chat
            })

            if (chats.length > 0) {
                chats.sort((c1, c2) => {
                    return dateFromString(c2.updateDate) - dateFromString(c1.updateDate)
                })
            }
            state.chats = chats
        },
        removeMessage(state, { payload }) {
            state.chats = state.chats.map((chat) => {
                if (chat._id === payload.chatId) {
                    chat.messages = chat.messages.filter((msg) => msg._id !== payload.msgId)
                }
                return chat
            })
        },
        setChatMessages(state, { payload }) {
            const { messages, threshold, hasMore } = payload
            const selectedChat = state.chats.find(({ _id }) => _id === state.selectedChatId)

            if (selectedChat) {
                selectedChat.messages = [
                    ...messages,
                    ...(selectedChat.messages?.filter(
                        (message) => !messages.map((msg) => msg._id).includes(message._id),
                    ) ?? []),
                ]
                selectedChat.threshold = threshold
                selectedChat.hasMore = hasMore
            }
        },
    },
    extraReducers: {
        [readChat.fulfilled](state, { payload }) {
            state.chats = state.chats.map((chat) => {
                if (chat._id === payload) {
                    state.unreadMsgCount -= chat.unreadCount
                    chat.unreadCount = 0
                }
                return chat
            })
        },
        [receiveMessage.fulfilled](state, action) {
            const { isMsgFromCurrentChat, message } = action.payload
            const chats = state.chats.map((chat) => {
                if (chat._id === message.chatId) {
                    chat.lastMessage = message
                    chat.updateDate = message.createDate

                    if (chat.messages) {
                        chat.messages = [...chat.messages, message]
                    }

                    if (chat._id !== state.selectedChatId) {
                        chat.unreadCount = message.chat.unreadCount
                    }
                }
                return chat
            })

            if (chats.length > 0) {
                chats.sort((c1, c2) => {
                    return dateFromString(c2.updateDate) - dateFromString(c1.updateDate)
                })
            }

            if (!isMsgFromCurrentChat) {
                state.unreadMsgCount += 1
            }

            state.chats = chats
        },
        [requestChats.pending](state) {
            state.areChatsLoading = true
        },
        [requestChats.fulfilled](state, { payload }) {
            let { chats, threshold } = payload

            state.chatThreshold = threshold
            state.chats = chats
            state.areChatsLoading = false
            state.unreadMsgCount = chats.reduce((result, chat) => result + chat.unreadCount, 0)
        },
        [requestMessages.pending](state) {
            state.areMessagesLoading = true
        },
        [requestMessages.fulfilled](state, { payload }) {
            const { chatId, items, thresholdMark } = payload
            state.chats = state.chats.map((chat) => {
                if (chat._id === chatId) {
                    chat.messages = items
                    chat.threshold = thresholdMark
                }
                return chat
            })
            state.areMessagesLoading = false
        },
        [requestChatsByThreshold.fulfilled](state, { payload }) {
            const { chats: newChats, threshold } = payload
            const newChatsIds = newChats.map(({ _id }) => _id)
            state.chats = [...newChats, ...state.chats.filter((chat) => !newChatsIds.includes(chat._id))].sort(
                (c1, c2) => {
                    return dateFromString(c2.updateDate) - dateFromString(c1.updateDate)
                },
            )
            if (newChats.length) {
                state.unreadMsgCount = newChats.reduce((result, chat) => result + chat.unreadCount, 0)
            }
            state.chatThreshold = threshold
        },
    },
})

export const getSelectedChat = ({ chat }) => chat.chats.find((c) => c._id === chat.selectedChatId)

export const {
    selectChat,
    setChatMessages,
    setUserOnlineStatus,
    setChats,
    startChat,
    clearChat,
    alterMessage,
    setUsersOnline,
    sendMessage,
    removeMessage,
    alterChat,
} = slice.actions

export default slice.reducer
