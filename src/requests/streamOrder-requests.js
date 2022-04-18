import { getAuth, postAuth } from './axiosConfig'
import { streamOrderEditFields, streamOrderFields } from './fields/streamOrder-fields'
import { streamFields } from './fields/stream-fields'

export const getStreamOrderById = async ({ id, fields = streamOrderFields }) => {
    const { data } = await getAuth(`/streamorders/${id}?_fields=${fields}`)
    return data.result
}

export const getStreamOrderForEdit = async ({ id, fields = streamOrderEditFields }) => {
    const { data } = await getAuth(`/streamorders/${id}?_fields=${fields}`)
    return data.result
}

export const closeOrder = async ({ orderId }) => {
 return postAuth(`/streamorders/${orderId}/close`)
}

export const getAcceptedStreamOrders = async ({
  streamOrderId,
  limit = 20,
  skip = 0,
  fields = streamFields,
} = {}) => {
    let qs = `_fields=${fields}&limit=${limit}&skip=${skip}&ignoreBlockedTags=true&sort=-createDate&search[status]=live|suspended|closed|announcement|archived&search[streamOrderId]=${streamOrderId}`
    const { data } = await getAuth(`/streams?${qs}`)
    return data.result
}

export const getReceivedOrders = async ({
    streamOrderId,
    limit = 20,
    skip = 0,
    fields = streamFields,
}) => {
    let qs = `_fields=${fields}&limit=${limit}&skip=${skip}&ignoreBlockedTags=true&sort=-createDate&search[status]=pending&search[streamOrderId]=${streamOrderId}`
    const { data } = await getAuth(`/streams?${qs}`)
    return data.result
}

export const getAcceptedOrdersCount = async ({streamOrderId}) => {
    let qs = `limit=1&ignoreBlockedTags=true&search[status]=live|suspended|closed|announcement|archived&search[streamOrderId]=${streamOrderId}`
    const { data } = await getAuth(`/streams?${qs}`)
    return data.result.totalCount
}

export const getCovers = async () => {
    const { data } = await getAuth('/ordercovers?_fields=items(url)')
    return data.result
}