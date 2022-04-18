import reduceFields from 'utils/reduceFields'

export const peopleFields = reduceFields({
    items: ['name', 'subscriberCount', 'photo', 'inMySubscriptions', 'totalEarned', 'totalSpent'],
})

export const orderFields = reduceFields({
    items: [
        'name',
        'cover',
        'price',
        'status',
        { user: ['name', 'photo'] },
        { tags: ['name'] },
        'confirmedPerformers',
        'startDate',
        'isPrivate',
    ],
})

export const tagFields = reduceFields({
    items: ['name', 'postCount'],
})

export const placeFields = reduceFields({
    items: [{ location: ['name'] }, 'postCount'],
})
