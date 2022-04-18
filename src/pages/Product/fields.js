import { reduceList } from 'utils/reduceFields'
export const productFields = reduceList(['name', 'description', 'photos', 'price'])
export const userFields = reduceList([
    'name',
    'subscriberCount',
    'photo',
    'inMySubscriptions',
    'totalEarned',
    'totalSpent',
])
