import { reduceList } from 'utils/reduceFields'

const fields = [
    'name',
    'description',
    'cover',
    { tags: ['name'] },
    'lockedFields',
    'isPrivate',
    'startDate',
    'price',
    { user: ['name', 'photo', 'subscriberCount', 'inMySubscriptions'] },
    'status',
    { location: ['name'] },
    'alreadyResponded',
]

export const streamOrderEditFields = reduceList([
    'name',
    'description',
    'cover',
    { tags: ['name'] },
    'price',
    'lockedFields',
    'isPrivate',
    { location: ['name'] },
    { invitedViewers: ['name'] },
    "startDate"
])

export const streamOrderFields = reduceList(fields)