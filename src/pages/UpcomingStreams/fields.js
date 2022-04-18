import reduceFields from '../../utils/reduceFields'

const fields = {
    items: [
        'name',
        'cover',
        'status',
        { streamer: ['name', 'photo'] },
        'startDate',
        'viewerCount',
        'subscriberCount',
        'isPrivate',
        'price',
        { tags: ['name'] },
    ],
}

export default reduceFields(fields)