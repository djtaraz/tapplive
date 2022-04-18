import reduceFields from 'utils/reduceFields'

export const userTransactions = reduceFields({
    items: [{ opponentUser: ['name', 'photo'] }, 'amount', 'isIncome', 'comment', 'type', 'createDate'],
})
