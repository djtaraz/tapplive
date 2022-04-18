import reduceFields from 'utils/reduceFields'

export default reduceFields({
    items: [
        {
            stream: [
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
                'thumbnailOrCoverUrl'
            ],
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
})
