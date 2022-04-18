import reduceFields, { reduceList } from 'utils/reduceFields'

export const streamFieldArray = [
    'name',
    'cover',
    'status',
    'startDate',
    { streamer: ['name', 'photo'] },
    { tags: ['name'] },
    'viewerCount',
    'subscriberCount',
    'price',
    'isPrivate',
    'haveTicket',
    'thumbnailOrCoverUrl',
]
export const streamDetailsFields = reduceList([
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
    'totalEarned',
    'viewerCount',
    'peakViewerCount',
    'videoUrl',
    'thumbnailOrCoverUrl',
    'subscriberCount',
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
export const streamFields = reduceFields({
    items: streamFieldArray,
})

const streamOrderFieldArray = [
    'name',
    'cover',
    'price',
    'status',
    { user: ['name', 'photo'] },
    { tags: ['name'] },
    'confirmedPerformers',
    'startDate',
    'isPrivate',
]

export const ordersFields = reduceFields({
    items: streamOrderFieldArray,
})
export const ordersAndStreamsFields = reduceList([
    {
        stream: streamFieldArray,
        streamOrder: streamOrderFieldArray,
    },
])

export const streamGoalFields = reduceFields({
    items: ['description', 'price', 'currentAmount', { user: ['name'] }, 'status', 'createDate'],
})

export const streamSettings = reduceList(['rtmpUrl', 'rtmpKey'])
