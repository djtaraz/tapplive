import { getAuth, get } from './axiosConfig'
import {
    ordersFields,
    streamDetailsFields,
    streamFields,
    streamGoalFields,
    streamSettings,
} from 'requests/fields/stream-fields'

export const getSubscriptions = async ({
    statuses = ['live', 'suspended', 'closed', 'announcement'],
    limit = 20,
    skip = 0,
    fields = streamFields,
} = {}) => {
    let qs = `_fields=${fields}&limit=${limit}&skip=${skip}&ignoreBlockedTags=true&sort=statusSortOrder,startDate`
    if (statuses) {
        qs += `&search[status]=${statuses.join('|')}`
    }

    const { data } = await getAuth(`/user/bought-streams?${qs}`)
    return data.result
}

export const getStreams = async ({
    streamerId,
    statuses,
    limit = 20,
    skip = 0,
    fields = streamFields,
    ignoreBlockedTags,
    sort,
} = {}) => {
    let qs = `_fields=${fields}&limit=${limit}&skip=${skip}`
    if (statuses) {
        qs += `&search[status]=${statuses.join('|')}`
    }
    if (streamerId) {
        qs += `&search[streamerId]=${streamerId}`
    }
    if (ignoreBlockedTags) {
        qs += `&ignoreBlockedTags=${ignoreBlockedTags}`
    }
    if (sort) {
        qs += `&sort=${sort}`
    }
    const { data } = await getAuth(`/streams?${qs}`)
    return data.result
}

export const getOrders = async ({ userId, limit = 20, skip = 0, fields = ordersFields, ignoreBlockedTags, sort }) => {
    let qs = `_fields=${fields}&limit=${limit}&skip=${skip}`
    if (userId) {
        qs += `&search[userId]=${userId}`
    }
    if (ignoreBlockedTags) {
        qs += `&ignoreBlockedTags=${ignoreBlockedTags}`
    }
    if (sort) {
        qs += `&sort=${sort}`
    }
    const { data } = await getAuth(`/streamorders?${qs}`)
    return data.result
}

export const getStreamMessages = async ({ streamId, skip, limit = 30, thresholdMark } = {}) => {
    let qs = `_fields=items(body,sender(name,photo),product(name,price,photos),createDate,transaction(amount,type))&limit=${limit}&sort=createDate`

    if (thresholdMark) {
        qs += `&thresholdMark=${thresholdMark}`
    }
    if (skip) {
        qs += `&skip=${skip}`
    }
    const { data } = await getAuth(`/streams/${streamId}/chat/messages?${qs}`)

    return data.result
}

export const getStreamDetails = async ({ streamId, fields = streamDetailsFields }) => {
    const { data } = await getAuth(`/streams/${streamId}?_fields=${fields}`)
    return data.result
}

export const getStreamerGoals = async ({ streamId }) => {
    const { data } = await getAuth(`/user/streams/${streamId}/goals?_fields=${streamGoalFields}&sort=-createDate`)
    return data.result.items
}

export const getStreamViewerGoals = async ({ streamId }) => {
    const { data } = await getAuth(`/streams/${streamId}/goals?_fields=${streamGoalFields}&sort=-createDate`)
    return data.result.items
}
export const getUpcomingStreams = async ({ skip, limit }) => {
    const { data } = await get(`/streams/upcoming?_fields=${streamFields}&skip=${skip}&limit=${limit}`)
    return data.result
}
export const getFollowedChannels = async ({ fields, skip, limit }) => {
    const { data } = await getAuth(`/user/subscriptions/content?_fields=${fields}&limit=${limit}&skip=${skip}`)
    return data.result
}
export const getFavoriteTags = async ({ fields, skip, limit }) => {
    const { data } = await getAuth(`/user/favorite-tags/content?_fields=${fields}&limit=${limit}&skip=${skip}`)
    return data.result
}

export const getStreamSettings = async ({ streamId, fields = streamSettings }) => {
    const { data } = await getAuth(`/streams/${streamId}?_fields=${fields}`)
    return data.result
}
