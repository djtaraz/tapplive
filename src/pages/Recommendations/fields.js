import reduceFields from 'utils/reduceFields'
import { streamFieldArray } from 'requests/fields/stream-fields'

const fields = {
    topStreams: streamFieldArray,
    popularUsers: ['name', 'subscriberCount', 'photo', 'inMySubscriptions'],
    topStreamOrders: [
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
    upcomingStreams: streamFieldArray,
}

export default reduceFields(fields)
