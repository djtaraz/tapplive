import { get } from './axiosConfig'
import { ordersAndStreamsFields } from 'requests/fields/stream-fields'

export const getFeed = async ({ tagIds = [], placeId, skip = 0, limit = 20, fields = ordersAndStreamsFields } = {}) => {
    let query = `_fields=items(${fields})&skip=${skip}&limit=${limit}`

    if (tagIds.length) {
        query += `&search[tagIds]=${tagIds.join(',')}`
    }
    if (placeId) {
        query += `&search[placeId]=${placeId}`
    }
    const { data } = await get(`/feed?${query}`)
    return data.result
}
