import reduceFields from '../../utils/reduceFields'

export const transactionFields = reduceFields({
    items: ['amount', 'type', { opponentUser: ['name', 'photo'] }, 'isIncome', 'status'],
})

export const userTransactions = reduceFields({
    items: [
        { opponentUser: ['name', 'photo'] },
        'amount',
        'isIncome',
        'comment',
        'type',
        'status',
        'createDate',
        { stream: ['name', 'cover', 'thumbnailOrCoverUrl'] },
    ],
})
