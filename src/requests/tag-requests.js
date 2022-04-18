import { get } from './axiosConfig'

export const getAllTags = async () => {
    const { data } = await get('/tags?_fields=items(name)')
    return data.result
}

export const getMyTags = async ({ excludeIds = [], skip = 0, limit = 20, q } = {}) => {
    let query = `_fields=items(name,postCount)&skip=${skip}&limit=${limit}`
    if(q) {
        query += `&q=${q}`
    }
    if(excludeIds.length) {
        query += `&excludeIds=${excludeIds.join(',')}`
    }
    const { data } = await get(`/tags?${query}`)
    return data.result
}