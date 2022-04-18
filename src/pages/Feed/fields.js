import reduceFields from '../../utils/reduceFields'
import { streamFieldArray } from '../../requests/fields/stream-fields'

export const allFields = reduceFields({
    subscriptionUserItems: [
        {
            stream: streamFieldArray,
        },
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
    ],
    boughtStreams: streamFieldArray,
    favoriteTagItems: [
        {
            stream: streamFieldArray,
        },
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
    ],
    recentStreams: [
        'name',
        'cover',
        { streamer: ['name', 'photo'] },
        'price',
        'thumbnailOrCoverUrl',
        'haveTicket',
        'subscriberCount',
    ],
})

export const streamsFields = reduceFields({
    items: streamFieldArray,
})

export const ordersFields = reduceFields({
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
