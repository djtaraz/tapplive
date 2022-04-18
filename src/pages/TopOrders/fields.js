import reduceFields from "../../utils/reduceFields";

const fields = {
    items: [
        'name',
        'cover',
        'price',
        'status',
        {user: ['name', 'photo']},
        {tags: ['name']},
        'confirmedPerformers',
        'startDate',
        'isPrivate'
    ],
}

export default reduceFields(fields)