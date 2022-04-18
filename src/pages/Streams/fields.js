import reduceFields, { reduceList } from 'utils/reduceFields'

export const streamFields = reduceList([
    'name',
    'startDate',
    'canDelay',
    'delayInterval',
    'endDate',
    'status',
    'haveTicket',
    'refundableDate',
    'editableDate',
    'isPrivate',
    'description',
    'cover',
    'viewerCount',
    'peakViewerCount',
    {
        streamOrder: [
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
    },
    { location: ['name'] },
    { tags: ['name'] },
    { price: ['value'] },
    { streamer: ['name', 'photo', 'subscriberCount'] },
])

export const reviewFields = reduceFields({
    items: [{ user: ['name', 'photo'] }, 'rating', 'body'],
})

export const transactionFields = reduceFields({
    items: [
        'type',
        'isIncome',
        'amount',
        {
            opponentUser: ['photo', 'name'],
        },
    ],
})
