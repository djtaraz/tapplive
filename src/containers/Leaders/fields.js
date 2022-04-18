import reduceFields from '../../utils/reduceFields'

const fields = {
    items: [
        {
            user: [
                'name',
                'photo',
                {
                    tLevel: [
                        {
                            misc: ['icon', 'frameColors'],
                        },
                    ],
                },
            ],
        },
        'totalSpentAndEarned',
    ],
}

export default reduceFields(fields)
