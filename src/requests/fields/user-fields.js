import reduceFields, { reduceList } from 'utils/reduceFields'

export const userFields = reduceList([
    'name',
    'photo',
    'subscriberCount',
    'subscriptionCount',
    'rating',
    'inMySubscriptions',
    'totalEarned',
    'totalSpent',
    {
        tLevel: [
            {
                misc: ['icon', 'frameColors'],
            },
        ],
    },
])

export const userActivityFields = reduceFields({
    items: [
        'type',
        'createDate',
        { warning: ['text'] },
        { user: ['name', 'photo'] },
        { stream: ['name', 'cover', 'thumbnailOrCoverUrl'] },
        { streamOrder: ['name', 'cover'] },
    ],
})
