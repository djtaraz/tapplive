import { getAuth } from './axiosConfig'
import { transactionFields, userTransactions } from './fields/transaction-fields'

export const getStreamTransactions = async ({ streamId, limit, skip, fields = transactionFields}) => {
    const { data } = await getAuth(`/streams/${streamId}/transactions?_fields=${fields}&limit=${limit}${skip ? `&skip=${skip}` : ''}`)
    return data.result
}

export const getUserTransactions = async ({ skip, limit = 20 } = {}) => {
    const { data } = await getAuth(`/user/transactions?_fields=${userTransactions}&limit=${limit}${skip ? `&skip=${skip}` : ''}`)
    return data.result
}