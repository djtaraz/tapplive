import reduceFields, { reduceList } from 'utils/reduceFields'

export const tag = reduceFields({
    items: ['name', 'postCount'],
})

export const userTags = (type) => reduceList([type])
