import { getAuth } from './axiosConfig'
import productFields from './fields/product-fields'

export const getProducts = async ({ limit = 20, skip = 0, userId } = {}) => {
    const { data } = await getAuth(`/users/${userId}/products?_fields=${productFields}&limit=${limit}&skip=${skip}`)
    return data.result
}