import { dateFromString } from 'utils/dateUtils'
import { getAuth, postAuth } from './axiosConfig'
import { messageListFields, sendMsgFields } from './fields/message-fields'

export const listMessages = async ({ chatId, threshold, skip = 0, limit = 30 }) => {
    const { data } = await getAuth(
        `/chats/${chatId}/messages?_fields=${messageListFields}&sort=-updateMark&limit=${limit}&skip=${skip}${
            threshold ? `&thresholdMark=${threshold}` : ''
        }`,
    )

    return {
        ...data.result,
        items: data.result.items.sort((a, b) => dateFromString(a.createDate) - dateFromString(b.createDate)),
    }
}

export const sendMsg = async (chatId, msg) => {
    const { data } = await postAuth(`/chats/${chatId}/messages?_fields=${sendMsgFields}`, msg)
    return data.result
}
