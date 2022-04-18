import { get, getAuth, postAuth } from './axiosConfig'
import { singleChatFields } from './fields/chat-fields'
import { userActivityFields, userFields } from './fields/user-fields'

export const listOnlineUsers = async () => {
    const { data } = await getAuth(`/online-users`)
    return data.result.items
}

export const startNewChat = async (userId) => {
    const { data } = await getAuth(`/users/${userId}/chat?_fields=${singleChatFields}`)
    return data.result
}

export const getReviews = async ({ userId }) => {
    const { data } = await get(`/users/${userId}/reviews`)
    return data.result
}

export const getUserData = async ({ userId, fields = userFields }) => {
    const { data } = await getAuth(`/users/${userId}?_fields=${fields}`)
    return data.result
}

export const followUser = async ({ userId }) => {
    await postAuth(`/users/${userId}/subscriptions`)
}

export const getUserSubscriptions = async ({ userId, limit = 4 } = {}) => {
    const { data } = await get(`/users/${userId}/subscriptions?_fields=items(name, photo)&limit=${limit}`)
    return data.result.items
}

export const getUsersList = async ({ fields, skip, limit }) => {
    const { data } = await getAuth(`/users?_fields=${fields}&skip=${skip}&limit=${limit}&sort=-subscriberCount`)
    return data.result
}

export const getUserActivities = async ({ limit = 20, skip }) => {
    const { data } = await getAuth(
        `/user/activities?_fields=${userActivityFields}&limit=${limit}${skip ? `&skip=${skip}` : ''}`,
    )

    return data.result
}

export const withdrawFromBalanceToEosAccount = async ({ amount, eosAccount }) => {
    const { data } = await postAuth('/user/wallet/withdraw/eos', {
        eosAccount,
        amount,
    })

    return data
}
export const withdrawFromBalanceToCreditCard = async ({
    amount,
    cardNumber,
    expMonth,
    expYear,
    cardholderName,
    email,
}) => {
    const { data } = await postAuth('/user/wallet/withdraw/powercash', {
        cardholderName,
        expYear,
        expMonth,
        cardNumber,
        amount,
        email,
    })

    return data
}
