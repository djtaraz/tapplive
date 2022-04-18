import reduceFields from '../../utils/reduceFields'

export default reduceFields({
    items: [
        'name',
        'cover',
        'status',
        'startDate',
        { streamer: ['name', 'photo'] },
        'viewerCount',
        'subscriberCount',
        'price',
        'isPrivate',
        { tags: ['name'] },
    ],
})
