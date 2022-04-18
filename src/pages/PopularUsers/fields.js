import reduceFields from '../../utils/reduceFields'

const fields = {
    items: ['name', 'subscriberCount', 'photo', 'inMySubscriptions', 'totalEarned', 'totalSpent'],
}

export default reduceFields(fields)
