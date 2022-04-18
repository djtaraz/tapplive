import { getAuth, postAuth, putAuth } from './axiosConfig'
import { chatListFields, singleChatFields } from './fields/chat-fields'

export const listChats = async ({ fields = chatListFields, chatThreshold, refetchCount = 20 }) => {
    let chats = []
    let requestCounter = 0

    let threshold = chatThreshold
    let chatsResult
    do {
        const { data } = await getAuth(`/chats?_fields=${fields}${threshold ? `&thresholdMark=${threshold}` : ''}`)
        chatsResult = data.result
        threshold = chatsResult.thresholdMark
        chats = [...chatsResult.items.reverse(), ...chats]
        requestCounter += 1
    } while (chatsResult?.hasMore && requestCounter < refetchCount)

    return { chats, threshold }
}

export const getUnreadMsgCount = async () => {
    const chats = await listChats({ fields: 'items(unreadCount)' })
    return chats.reduce((count, chat) => count + chat.unreadCount, 0)
}

export const blockChat = async (chatId) => {
    const { data } = await postAuth(`/chats/${chatId}/block?_fields=${singleChatFields}`)
    return data.result
}

export const unblockChat = async (chatId) => {
    const { data } = await postAuth(`/chats/${chatId}/unblock?_fields=${singleChatFields}`)
    return data.result
}

export const disableNotifications = async (chatId) => {
    const { data } = await putAuth(`/chats/${chatId}/settings?_fields=${singleChatFields}`, { showNotifications: false })
    return data.result
}

export const enableNotifications = async (chatId) => {
    const { data } = await putAuth(`/chats/${chatId}/settings?_fields=${singleChatFields}`, { showNotifications: true })
    return data.result
}