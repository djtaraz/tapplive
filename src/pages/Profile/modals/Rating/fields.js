import reduceFields, { reduceList } from 'utils/reduceFields'

export const tLevel = reduceList(['totalEarned', 'totalSpent'])

export const profileData = reduceList([
    'name',
    'photo',
    'rating',
    {
        tLevel: [
            {
                misc: ['icon', 'frameColors'],
            },
        ],
    },
])
export const review = reduceFields({
    items: ['body', 'rating', { user: ['name', 'photo'] }],
})
