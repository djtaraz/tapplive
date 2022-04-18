import reduceFields from 'utils/reduceFields'
import { streamFieldArray } from '../../requests/fields/stream-fields'

export default reduceFields({
    items: [
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
})
