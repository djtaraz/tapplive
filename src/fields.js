import { reduceList } from './utils/reduceFields'

const meFieldsArray = [
    'name',
    'login',
    { favoriteTags: ['name'] },
    'blockedTags',
    'subscriberCount',
    'subscriptionCount',
    'rating',
    'photo',
    {
        tLevel: [
            {
                misc: ['icon', 'frameColors'],
            },
        ],
    },
    { balances: ['usd', 'usdHold'] },
    'unreadActivityCount',
    'registerBySocNet',
]
export const meFields = reduceList(meFieldsArray)
